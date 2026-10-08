import { fireEvent, render, screen } from '@testing-library/react';

import { SmartActionPanel } from './action-panel';
import { SmartActionPanelProps } from './action-panel.types';
import { SmartActionPanelPreset } from './preset/action-panel-preset';
import { SmartActionPanelStandard } from './standard/action-panel-standard';
import { SmartActionPanelLayout } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartActionPanel', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartActionPanel options={{ title: 'Hello' }} />,
      );

      expect(container.querySelector('section.action-panel')).toHaveTextContent(
        'Hello',
      );
    });

    it('should pass className to the standard implementation', () => {
      const { container } = render(<SmartActionPanel className="wrap" />);

      expect(container.firstElementChild).toHaveClass('wrap');
    });

    it('should pass onActionClick to the standard implementation', () => {
      const onActionClick = jest.fn();
      render(
        <SmartActionPanel
          options={{ actions: [{ id: 'a', label: 'Go' }] }}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Go' }));

      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'a' });
    });

    it('should render the implementation registered as components.action-panel', () => {
      const Custom = ({ options, onActionClick }: SmartActionPanelProps) => (
        <button onClick={() => onActionClick?.({ actionId: 'custom' })}>
          {options?.title}
        </button>
      );
      const onActionClick = jest.fn();

      const { container } = render(
        <SmartProvider components={{ 'action-panel': Custom }}>
          <SmartActionPanel
            options={{ title: 'Custom panel' }}
            onActionClick={onActionClick}
          />
        </SmartProvider>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Custom panel' }));

      expect(container.querySelector('section.action-panel')).toBeNull();
      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'custom' });
    });
  });

  describe('standard', () => {
    it('should always render section.action-panel', () => {
      const { container } = render(<SmartActionPanelStandard />);

      expect(
        container.querySelector('section.action-panel'),
      ).toBeInTheDocument();
    });

    it('should render the title in an h3', () => {
      render(<SmartActionPanelStandard options={{ title: 'Manage plan' }} />);

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Manage plan',
      );
    });

    it('should not render an h3 without options.title', () => {
      render(<SmartActionPanelStandard options={{}} />);

      expect(screen.queryByRole('heading')).toBeNull();
    });

    it('should render the description text', () => {
      const { container } = render(
        <SmartActionPanelStandard options={{ description: 'Lorem ipsum.' }} />,
      );

      expect(container.querySelector('p.description')).toHaveTextContent(
        'Lorem ipsum.',
      );
    });

    it('should let descriptionTpl override the description text', () => {
      const { container } = render(
        <SmartActionPanelStandard
          options={{
            description: 'ignored',
            descriptionTpl: <span className="tpl">Rich</span>,
          }}
        />,
      );

      expect(
        container.querySelector('div.description span.tpl'),
      ).toBeInTheDocument();
      expect(container).not.toHaveTextContent('ignored');
    });

    it('should render contentTpl inside div.content', () => {
      const { container } = render(
        <SmartActionPanelStandard
          options={{ contentTpl: <input aria-label="Email" /> }}
        />,
      );

      expect(container.querySelector('div.content input')).toBeInTheDocument();
    });

    it('should not render the actions container without actions', () => {
      const { container } = render(
        <SmartActionPanelStandard options={{ actions: [] }} />,
      );

      expect(container.querySelector('div.actions')).toBeNull();
    });

    it('should render action buttons with variant classes', () => {
      const { container } = render(
        <SmartActionPanelStandard
          options={{
            actions: [
              { id: 'change', label: 'Change plan', variant: 'primary' },
              { id: 'cancel', label: 'Cancel', variant: 'ghost' },
            ],
          }}
        />,
      );

      const buttons = container.querySelectorAll('button.action');

      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveClass('variant-primary');
      expect(buttons[0]).toHaveTextContent('Change plan');
      expect(buttons[1]).toHaveClass('variant-ghost');
    });

    it('should render an anchor when action.href is set', () => {
      render(
        <SmartActionPanelStandard
          options={{
            actions: [
              {
                id: 'learn',
                label: 'Learn more',
                href: '/learn',
                variant: 'link',
              },
            ],
          }}
        />,
      );

      const anchor = screen.getByRole('link', { name: 'Learn more' });

      expect(anchor).toHaveAttribute('href', '/learn');
      expect(anchor).toHaveClass('action', 'variant-link');
    });

    it('should default the anchor variant to link', () => {
      render(
        <SmartActionPanelStandard
          options={{ actions: [{ id: 'learn', label: 'Docs', href: '/d' }] }}
        />,
      );

      expect(screen.getByRole('link', { name: 'Docs' })).toHaveClass(
        'variant-link',
      );
    });

    it('should default the button variant to primary', () => {
      render(
        <SmartActionPanelStandard
          options={{ actions: [{ id: 'submit', label: 'Submit' }] }}
        />,
      );

      expect(screen.getByRole('button', { name: 'Submit' })).toHaveClass(
        'variant-primary',
      );
    });

    it('should render the action icon in span.icon', () => {
      const { container } = render(
        <SmartActionPanelStandard
          options={{
            actions: [{ id: 'add', iconTpl: <svg data-testid="icon" /> }],
          }}
        />,
      );

      expect(
        container.querySelector('button.action span.icon svg'),
      ).toBeInTheDocument();
    });

    it('should call onActionClick with the action id on click', () => {
      const onActionClick = jest.fn();
      render(
        <SmartActionPanelStandard
          options={{ actions: [{ id: 'submit', label: 'Submit' }] }}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(onActionClick).toHaveBeenCalledTimes(1);
      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'submit' });
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartActionPanelStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    function zone(container: HTMLElement, role: string): HTMLElement | null {
      return container.querySelector(`[data-role="${role}"]`);
    }

    it('should render a panel card', () => {
      const { container } = render(
        <SmartActionPanelPreset options={{ title: 'Settings' }} />,
      );

      expect(zone(container, 'panel')).toHaveClass(
        'smart:rounded-xl',
        'smart:bg-white',
      );
    });

    it('should render the title with heading classes', () => {
      const { container } = render(
        <SmartActionPanelPreset options={{ title: 'Delete account' }} />,
      );

      const title = zone(container, 'title');

      expect(title).toHaveTextContent('Delete account');
      expect(title).toHaveClass('smart:font-semibold', 'smart:text-gray-900');
    });

    it('should render the plain description text', () => {
      const { container } = render(
        <SmartActionPanelPreset
          options={{ title: 'A', description: 'Some helper text' }}
        />,
      );

      const description = zone(container, 'description');

      expect(description?.tagName).toBe('P');
      expect(description).toHaveTextContent('Some helper text');
      expect(description).toHaveClass('smart:text-gray-500');
    });

    it('should let descriptionTpl override the description text', () => {
      const { container } = render(
        <SmartActionPanelPreset
          options={{
            title: 'A',
            description: 'ignored',
            descriptionTpl: (
              <span className="tpl-description">Rich description</span>
            ),
          }}
        />,
      );

      const description = zone(container, 'description');

      expect(
        description?.querySelector('.tpl-description'),
      ).toBeInTheDocument();
      expect(description).not.toHaveTextContent('ignored');
    });

    it('should render contentTpl inside the content zone', () => {
      const { container } = render(
        <SmartActionPanelPreset
          options={{
            title: 'A',
            contentTpl: <div className="tpl-content">Panel body</div>,
          }}
        />,
      );

      expect(
        zone(container, 'content')?.querySelector('.tpl-content'),
      ).toBeInTheDocument();
    });

    it('should render each action with data-role and data-action-id', () => {
      const { container } = render(
        <SmartActionPanelPreset
          options={{
            title: 'A',
            actions: [
              { id: 'save', label: 'Save' },
              { id: 'cancel', label: 'Cancel' },
            ],
          }}
        />,
      );

      const actions = Array.from(
        container.querySelectorAll('[data-role="action"]'),
      );

      expect(actions.map((a) => a.getAttribute('data-action-id'))).toEqual([
        'save',
        'cancel',
      ]);
      expect(zone(container, 'actions')).toBeInTheDocument();
    });

    it('should call onActionClick with the id when a button action is clicked', () => {
      const onActionClick = jest.fn();
      render(
        <SmartActionPanelPreset
          options={{ title: 'A', actions: [{ id: 'delete', label: 'Delete' }] }}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'delete' });
    });

    it('should style a primary action as a solid blue button', () => {
      render(
        <SmartActionPanelPreset
          options={{
            title: 'A',
            actions: [{ id: 'save', label: 'Save', variant: 'primary' }],
          }}
        />,
      );

      expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
        'smart:bg-blue-600',
        'smart:text-white',
      );
    });

    it('should style a non-primary action as an outline button', () => {
      render(
        <SmartActionPanelPreset
          options={{
            title: 'A',
            actions: [{ id: 'cancel', label: 'Cancel', variant: 'secondary' }],
          }}
        />,
      );

      const button = screen.getByRole('button', { name: 'Cancel' });

      expect(button).toHaveClass('smart:border-gray-200');
      expect(button).not.toHaveClass('smart:bg-blue-600');
    });

    it('should render an href action as an anchor', () => {
      render(
        <SmartActionPanelPreset
          options={{
            title: 'A',
            actions: [{ id: 'docs', label: 'Docs', href: '/docs' }],
          }}
        />,
      );

      expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
        'href',
        '/docs',
      );
    });

    it.each<SmartActionPanelLayout>([
      'simple',
      'with-link',
      'right-button',
      'top-right-button',
      'with-toggle',
      'with-input',
      'well',
      'payment-method',
    ])(
      'should render the "%s" layout and expose it via data-layout',
      (layout) => {
        const { container } = render(
          <SmartActionPanelPreset
            options={{
              title: 'A',
              description: 'B',
              contentTpl: <div>Panel body</div>,
              layout,
              actions: [{ id: 'go', label: 'Go' }],
            }}
          />,
        );

        expect(zone(container, 'panel')).toHaveAttribute('data-layout', layout);
        expect(zone(container, 'title')).toBeInTheDocument();
        expect(zone(container, 'description')).toBeInTheDocument();
        expect(zone(container, 'content')).toBeInTheDocument();
        expect(zone(container, 'actions')).toBeInTheDocument();
      },
    );

    it('should default to the simple layout', () => {
      const { container } = render(
        <SmartActionPanelPreset options={{ title: 'A' }} />,
      );

      expect(zone(container, 'panel')).toHaveAttribute('data-layout', 'simple');
    });

    it('should render actions as underlined links for the with-link layout', () => {
      render(
        <SmartActionPanelPreset
          options={{
            title: 'A',
            layout: 'with-link',
            actions: [{ id: 'more', label: 'Learn more' }],
          }}
        />,
      );

      expect(screen.getByRole('button', { name: 'Learn more' })).toHaveClass(
        'smart:text-blue-600',
        'smart:hover:underline',
      );
    });

    it('should wrap content and actions in a well for the well layout', () => {
      const { container } = render(
        <SmartActionPanelPreset
          options={{
            title: 'A',
            layout: 'well',
            contentTpl: <div>Panel body</div>,
            actions: [{ id: 'go', label: 'Go' }],
          }}
        />,
      );

      const well = zone(container, 'well');

      expect(well).toHaveClass('smart:bg-gray-50');
      expect(well?.querySelector('[data-role="content"]')).toBeInTheDocument();
      expect(well?.querySelector('[data-role="actions"]')).toBeInTheDocument();
    });

    it('should arrange the right-button layout as a flex row', () => {
      const { container } = render(
        <SmartActionPanelPreset
          options={{
            title: 'A',
            layout: 'right-button',
            actions: [{ id: 'go', label: 'Go' }],
          }}
        />,
      );

      const row = zone(container, 'panel')?.firstElementChild;

      expect(row).toHaveClass('smart:flex', 'smart:justify-between');
      expect(zone(container, 'actions')).toHaveClass('smart:flex-col');
    });

    it('should put the actions next to the title for the top-right-button layout', () => {
      const { container } = render(
        <SmartActionPanelPreset
          options={{
            title: 'A',
            layout: 'top-right-button',
            actions: [{ id: 'go', label: 'Go' }],
          }}
        />,
      );

      const row = zone(container, 'panel')?.firstElementChild;

      expect(row?.children[0]).toBe(zone(container, 'title'));
      expect(row?.children[1]).toBe(zone(container, 'actions'));
      expect(zone(container, 'actions')).toHaveClass('smart:shrink-0');
    });

    it('should put the content next to the text for the with-toggle layout', () => {
      const { container } = render(
        <SmartActionPanelPreset
          options={{
            title: 'A',
            layout: 'with-toggle',
            contentTpl: <div>Toggle</div>,
          }}
        />,
      );

      const row = zone(container, 'panel')?.firstElementChild;

      expect(row?.children[1]).toBe(zone(container, 'content'));
    });

    it('should merge className onto the panel', () => {
      const { container } = render(
        <SmartActionPanelPreset
          className="my-extra"
          options={{ title: 'A' }}
        />,
      );

      expect(zone(container, 'panel')).toHaveClass('my-extra');
    });
  });
});
