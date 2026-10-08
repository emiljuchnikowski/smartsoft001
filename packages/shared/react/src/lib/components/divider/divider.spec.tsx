import { fireEvent, render, screen } from '@testing-library/react';

import { SmartDivider } from './divider';
import { SmartDividerProps } from './divider.types';
import { SmartDividerPreset } from './preset/divider-preset';
import { SmartDividerStandard } from './standard/divider-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartDivider', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartDivider />);

      expect(container.querySelector('[role="separator"] > hr')).not.toBeNull();
    });

    it('should render the implementation registered as components.divider', () => {
      const Custom = ({ label }: SmartDividerProps) => (
        <span data-testid="custom">{label}</span>
      );

      render(
        <SmartProvider components={{ divider: Custom }}>
          <SmartDivider label="My label" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('My label');
    });

    it('should pass the inputs to the implementation', () => {
      render(
        <SmartDivider
          title="My title"
          options={{ position: 'left' }}
          className="passed-class"
        />,
      );

      expect(screen.getByRole('separator')).toHaveAttribute(
        'data-position',
        'left',
      );
    });

    it('should call onActionClick of the implementation', () => {
      const onActionClick = jest.fn();
      render(
        <SmartDivider actionLabel="Click" onActionClick={onActionClick} />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Click' }));

      expect(onActionClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('standard', () => {
    function separator(container: HTMLElement): HTMLElement {
      return container.querySelector('div[role="separator"]') as HTMLElement;
    }

    it('should render an element with role="separator"', () => {
      const { container } = render(<SmartDividerStandard />);

      expect(separator(container)).toBeInTheDocument();
    });

    it('should render <hr /> when no label, title or actionLabel is given', () => {
      const { container } = render(<SmartDividerStandard />);

      expect(separator(container).querySelector('hr')).not.toBeNull();
    });

    it.each([
      ['label', { label: 'My label' }],
      ['title', { title: 'My title' }],
      ['actionLabel', { actionLabel: 'Action' }],
    ])('should not render <hr /> when %s is given', (_name, props) => {
      const { container } = render(<SmartDividerStandard {...props} />);

      expect(separator(container).querySelector('hr')).toBeNull();
    });

    it('should render the label', () => {
      render(<SmartDividerStandard label="My label" />);

      expect(screen.getByText('My label')).toHaveClass('smart-divider-label');
    });

    it('should render the title as a heading', () => {
      render(<SmartDividerStandard title="My title" />);

      expect(
        screen.getByRole('heading', { level: 3, name: 'My title' }),
      ).toHaveClass('smart-divider-title');
    });

    it('should render the action button', () => {
      render(<SmartDividerStandard actionLabel="Click me" />);

      expect(screen.getByRole('button', { name: 'Click me' })).toHaveClass(
        'smart-divider-action',
      );
    });

    it('should call onActionClick when the action button is clicked', () => {
      const onActionClick = jest.fn();
      render(
        <SmartDividerStandard
          actionLabel="Click me"
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }));

      expect(onActionClick).toHaveBeenCalledTimes(1);
    });

    it('should set data-position from options.position', () => {
      const { container } = render(
        <SmartDividerStandard options={{ position: 'left' }} />,
      );

      expect(separator(container)).toHaveAttribute('data-position', 'left');
    });

    it('should default data-position to "center"', () => {
      const { container } = render(<SmartDividerStandard />);

      expect(separator(container)).toHaveAttribute('data-position', 'center');
    });

    it('should apply className on the separator', () => {
      const { container } = render(
        <SmartDividerStandard className="my-extra-class" />,
      );

      expect(separator(container)).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    it('should render a plain hr when no content is given', () => {
      render(<SmartDividerPreset />);

      const separator = screen.getByRole('separator');

      expect(separator.tagName).toBe('HR');
      expect(separator).toHaveClass(
        'smart:border-gray-200',
        'smart:dark:border-neutral-700',
      );
    });

    it('should apply className on the plain hr', () => {
      render(<SmartDividerPreset className="my-extra-class" />);

      expect(screen.getByRole('separator')).toHaveClass('my-extra-class');
    });

    it('should render an inline label divider', () => {
      render(<SmartDividerPreset label="Continue with" />);

      expect(screen.getByRole('separator')).toHaveTextContent('Continue with');
      expect(screen.getByRole('separator')).toHaveClass('smart:text-gray-800');
    });

    it('should draw both connecting lines for the default center position', () => {
      render(<SmartDividerPreset label="Or" />);

      expect(screen.getByRole('separator')).toHaveClass(
        'smart:before:flex-1',
        'smart:after:flex-1',
      );
    });

    it('should draw only the trailing line for the left position', () => {
      render(
        <SmartDividerPreset label="Left" options={{ position: 'left' }} />,
      );

      const separator = screen.getByRole('separator');

      expect(separator).toHaveClass('smart:after:flex-1');
      expect(separator).not.toHaveClass('smart:before:flex-1');
    });

    it('should draw only the leading line for the right position', () => {
      render(
        <SmartDividerPreset label="Right" options={{ position: 'right' }} />,
      );

      const separator = screen.getByRole('separator');

      expect(separator).toHaveClass('smart:before:flex-1');
      expect(separator).not.toHaveClass('smart:after:flex-1');
    });

    it('should apply the uppercase muted treatment for the title variant', () => {
      render(
        <SmartDividerPreset title="Or" options={{ variant: 'with-title' }} />,
      );

      const separator = screen.getByRole('separator');

      expect(separator).toHaveTextContent('Or');
      expect(separator).toHaveClass('smart:uppercase', 'smart:text-gray-600');
    });

    it('should infer the title variant from the title', () => {
      render(<SmartDividerPreset title="Or" />);

      expect(screen.getByRole('separator')).toHaveClass('smart:uppercase');
    });

    it('should prefer the label as content outside the title variant', () => {
      render(
        <SmartDividerPreset
          label="Label"
          title="Title"
          options={{ variant: 'with-label' }}
        />,
      );

      expect(screen.getByRole('separator')).toHaveTextContent(/^Label$/);
    });

    it('should prefer the title as content in the title variant', () => {
      render(
        <SmartDividerPreset
          label="Label"
          title="Title"
          options={{ variant: 'with-title' }}
        />,
      );

      expect(screen.getByRole('separator')).toHaveTextContent(/^Title$/);
    });

    it('should render an icon slot for the icon variant', () => {
      render(
        <SmartDividerPreset
          iconName="star"
          options={{ variant: 'with-icon' }}
        />,
      );

      const icon = screen.getByText('star');

      expect(icon.tagName).toBe('SPAN');
      expect(icon).toHaveClass('smart:size-4');
    });

    it('should render an action button for the button variant', () => {
      render(<SmartDividerPreset actionLabel="Add item" />);

      expect(screen.getByRole('button', { name: 'Add item' })).toHaveClass(
        'smart:rounded-lg',
      );
    });

    it('should render the icon inside the action button', () => {
      render(<SmartDividerPreset actionLabel="Add item" iconName="+" />);

      expect(screen.getByRole('button')).toHaveTextContent('+Add item');
    });

    it('should call onActionClick when the action button is clicked', () => {
      const onActionClick = jest.fn();
      render(
        <SmartDividerPreset
          actionLabel="Add item"
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Add item' }));

      expect(onActionClick).toHaveBeenCalledTimes(1);
    });

    it('should render label, line and action for the toolbar variant', () => {
      render(
        <SmartDividerPreset
          label="Tools"
          actionLabel="Add"
          options={{ variant: 'with-toolbar' }}
        />,
      );

      const separator = screen.getByRole('separator');

      expect(separator).toHaveTextContent('Tools');
      expect(separator).toHaveClass('smart:gap-x-4');
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
      expect(separator.querySelector('div')).toHaveClass('smart:flex-1');
    });

    it('should call onActionClick from the toolbar action', () => {
      const onActionClick = jest.fn();
      render(
        <SmartDividerPreset
          label="Tools"
          actionLabel="Add"
          options={{ variant: 'with-toolbar' }}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Add' }));

      expect(onActionClick).toHaveBeenCalledTimes(1);
    });

    it('should apply className on the separator', () => {
      render(<SmartDividerPreset label="Or" className="my-extra-class" />);

      expect(screen.getByRole('separator')).toHaveClass('my-extra-class');
    });
  });
});
