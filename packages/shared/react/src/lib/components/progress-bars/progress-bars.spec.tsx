import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProgressBarsPreset } from './preset/progress-bars-preset';
import { SmartProgressBars } from './progress-bars';
import { SmartProgressBarsProps } from './progress-bars.types';
import { SmartProgressBarsStandard } from './standard/progress-bars-standard';
import {
  createHistoryNavigation,
  ISmartLinkProps,
  ISmartNavigation,
} from '../../providers/navigation';
import { SmartProvider } from '../../providers/smart-provider';

function routerNavigation(): ISmartNavigation {
  return {
    ...createHistoryNavigation(),
    linkComponent: ({ children, ...props }: ISmartLinkProps) => (
      <a data-router-link="" {...props}>
        {children}
      </a>
    ),
  };
}

describe('@smartsoft001/react: SmartProgressBars', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      render(<SmartProgressBars />);

      expect(screen.getByRole('navigation', { name: 'Progress' })).toHaveClass(
        'progress-bars',
      );
    });

    it('should render the implementation registered as components.progress-bars', () => {
      const Custom = ({ options }: SmartProgressBarsProps) => (
        <div data-testid="custom">{options?.steps?.length}</div>
      );

      render(
        <SmartProvider components={{ 'progress-bars': Custom }}>
          <SmartProgressBars options={{ steps: [{ id: 's1' }] }} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('1');
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should pass onStepClick to the registered implementation', () => {
      const onStepClick = jest.fn();
      const Custom = (props: SmartProgressBarsProps) => (
        <button
          type="button"
          onClick={() => props.onStepClick?.({ stepId: 's1' })}
        >
          custom
        </button>
      );
      render(
        <SmartProvider components={{ 'progress-bars': Custom }}>
          <SmartProgressBars onStepClick={onStepClick} />
        </SmartProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'custom' }));

      expect(onStepClick).toHaveBeenCalledWith({ stepId: 's1' });
    });
  });

  describe('standard', () => {
    describe('steps', () => {
      it('should set data-layout from options.layout', () => {
        render(
          <SmartProgressBarsStandard
            options={{ layout: 'circles', steps: [] }}
          />,
        );

        expect(screen.getByRole('navigation')).toHaveAttribute(
          'data-layout',
          'circles',
        );
      });

      it('should default data-layout to simple', () => {
        render(<SmartProgressBarsStandard options={{ steps: [] }} />);

        expect(screen.getByRole('navigation')).toHaveAttribute(
          'data-layout',
          'simple',
        );
      });

      it('should render the title', () => {
        const { container } = render(
          <SmartProgressBarsStandard options={{ title: 'Checkout' }} />,
        );

        expect(
          container.querySelector('nav > p.progress-bars-title'),
        ).toHaveTextContent('Checkout');
      });

      it('should render a step with an href as the current link', () => {
        const { container } = render(
          <SmartProgressBarsStandard
            options={{
              steps: [
                { id: 's1', name: 'Step 1', href: '/step1', status: 'current' },
              ],
            }}
          />,
        );

        const link = container.querySelector('a.progress-bars-step-link');

        expect(link).toHaveAttribute('href', '/step1');
        expect(link).toHaveAttribute('aria-current', 'step');
        expect(link).toHaveClass('current');
        expect(link).toHaveTextContent('Step 1');
      });

      it('should render a step without an href as a button and call onStepClick', () => {
        const onStepClick = jest.fn();
        const { container } = render(
          <SmartProgressBarsStandard
            options={{ steps: [{ id: 's2', name: 'Step 2' }] }}
            onStepClick={onStepClick}
          />,
        );

        const button = container.querySelector(
          'button.progress-bars-step-button',
        ) as HTMLElement;
        fireEvent.click(button);

        expect(button).not.toHaveAttribute('aria-current');
        expect(onStepClick).toHaveBeenCalledWith({ stepId: 's2' });
      });

      it('should set the status class and data-status of each step', () => {
        const { container } = render(
          <SmartProgressBarsStandard
            options={{
              steps: [
                { id: 's1', status: 'complete' },
                { id: 's2', status: 'current' },
                { id: 's3' },
              ],
            }}
          />,
        );

        const steps = container.querySelectorAll('ol li.progress-bars-step');

        expect(steps).toHaveLength(3);
        expect(steps[0]).toHaveAttribute('data-status', 'complete');
        expect(steps[0]).toHaveClass('status-complete');
        expect(steps[1]).toHaveAttribute('data-status', 'current');
        expect(steps[1]).toHaveClass('status-current');
        expect(steps[2]).toHaveAttribute('data-status', 'upcoming');
        expect(steps[2]).toHaveClass('status-upcoming');
      });

      it('should render the step description and index', () => {
        const { container } = render(
          <SmartProgressBarsStandard
            options={{
              steps: [
                {
                  id: 's1',
                  name: 'Job',
                  index: '02',
                  description: 'Vitae sed mi.',
                  href: '/',
                },
              ],
            }}
          />,
        );

        expect(
          container.querySelector('.progress-bars-step-index'),
        ).toHaveTextContent('02');
        expect(
          container.querySelector('.progress-bars-step-name'),
        ).toHaveTextContent('Job');
        expect(
          container.querySelector('.progress-bars-step-description'),
        ).toHaveTextContent('Vitae sed mi.');
      });

      it('should render the step icon instead of the index', () => {
        const { container } = render(
          <SmartProgressBarsStandard
            options={{
              steps: [{ id: 's1', index: '01', iconTpl: <i>icon</i> }],
            }}
          />,
        );

        expect(
          container.querySelector('.progress-bars-step-icon'),
        ).toHaveTextContent('icon');
        expect(
          container.querySelector('.progress-bars-step-index'),
        ).not.toBeInTheDocument();
      });

      it('should render internal step links through the navigation linkComponent', () => {
        render(
          <SmartProvider navigation={routerNavigation()}>
            <SmartProgressBarsStandard
              options={{
                steps: [
                  { id: 's1', name: 'Step 1', href: '/s1', status: 'current' },
                ],
              }}
            />
          </SmartProvider>,
        );

        const link = screen.getByRole('link', { name: 'Step 1' });

        expect(link).toHaveAttribute('data-router-link');
        expect(link).toHaveAttribute('aria-current', 'step');
      });

      it('should apply className on the nav', () => {
        render(
          <SmartProgressBarsStandard
            className="extra"
            options={{ steps: [] }}
          />,
        );

        expect(screen.getByRole('navigation')).toHaveClass(
          'progress-bars',
          'extra',
        );
      });
    });

    describe('progress-bar layout', () => {
      it('should render the bar instead of the steps', () => {
        const { container } = render(
          <SmartProgressBarsStandard
            className="extra"
            options={{
              layout: 'progress-bar',
              title: 'Migrating MySQL database...',
              srOnlyTitle: 'Migration',
              value: 37.5,
            }}
          />,
        );

        const wrapper = container.firstElementChild as HTMLElement;
        const fill = container.querySelector('.progress-bars-fill');

        expect(wrapper).toHaveClass('progress-bars-bar-wrapper', 'extra');
        expect(wrapper.querySelector('h4.sr-only')).toHaveTextContent(
          'Migration',
        );
        expect(
          wrapper.querySelector('p.progress-bars-title'),
        ).toHaveTextContent('Migrating MySQL database...');
        expect(container.querySelector('.progress-bars-track')).toHaveAttribute(
          'aria-hidden',
          'true',
        );
        expect(fill).toHaveStyle({ width: '37.5%' });
        expect(fill).toHaveAttribute('role', 'progressbar');
        expect(fill).toHaveAttribute('aria-valuenow', '37.5');
        expect(fill).toHaveAttribute('aria-valuemin', '0');
        expect(fill).toHaveAttribute('aria-valuemax', '100');
        expect(container.querySelector('nav')).not.toBeInTheDocument();
      });

      it.each([
        [150, '100%'],
        [-5, '0%'],
        [undefined, '0%'],
      ])('should clamp the value %s to %s', (value, width) => {
        const { container } = render(
          <SmartProgressBarsStandard
            options={{ layout: 'progress-bar', value }}
          />,
        );

        expect(container.querySelector('.progress-bars-fill')).toHaveStyle({
          width,
        });
      });

      it('should render the column labels', () => {
        const { container } = render(
          <SmartProgressBarsStandard
            options={{
              layout: 'progress-bar',
              value: 50,
              columns: [
                { label: 'Copying files', active: true },
                { label: 'Migrating', active: false },
              ],
            }}
          />,
        );

        const columns = container.querySelector(
          '.progress-bars-columns',
        ) as HTMLElement;
        const cols = columns.querySelectorAll('.progress-bars-column');

        expect(columns.style.getPropertyValue('--progress-columns')).toBe('2');
        expect(cols).toHaveLength(2);
        expect(cols[0]).toHaveTextContent('Copying files');
        expect(cols[0]).toHaveClass('active');
        expect(cols[1]).not.toHaveClass('active');
      });
    });
  });

  describe('preset', () => {
    describe('progress-bar layout', () => {
      it('should render the track and the fill with the clamped width', () => {
        render(
          <SmartProgressBarsPreset
            options={{ layout: 'progress-bar', value: 25 }}
          />,
        );

        const bar = screen.getByRole('progressbar', { name: 'Progress' });

        expect(bar).toHaveAttribute('aria-valuenow', '25');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
        expect(bar.firstElementChild).toHaveStyle({ width: '25%' });
        expect(bar.firstElementChild).toHaveClass('smart:bg-blue-600');
      });

      it('should clamp out-of-range values into [0, 100]', () => {
        render(
          <SmartProgressBarsPreset
            options={{ layout: 'progress-bar', value: 150 }}
          />,
        );

        expect(screen.getByRole('progressbar')).toHaveAttribute(
          'aria-valuenow',
          '100',
        );
      });

      it('should render a title header with the percentage label', () => {
        const { container } = render(
          <SmartProgressBarsPreset
            options={{ layout: 'progress-bar', value: 50, title: 'Uploading' }}
          />,
        );

        expect(container.querySelector('h3')).toHaveTextContent('Uploading');
        expect(container.querySelector('h3 + span')).toHaveTextContent('50%');
      });

      it('should render a screen-reader-only title', () => {
        const { container } = render(
          <SmartProgressBarsPreset
            options={{
              layout: 'progress-bar',
              value: 10,
              srOnlyTitle: 'Loading',
            }}
          />,
        );

        expect(container.querySelector('h4.smart\\:sr-only')).toHaveTextContent(
          'Loading',
        );
      });

      it('should render the column captions and highlight the active ones', () => {
        const { container } = render(
          <SmartProgressBarsPreset
            options={{
              layout: 'progress-bar',
              value: 50,
              columns: [
                { label: 'Start' },
                { label: 'Half', active: true },
                { label: 'End' },
              ],
            }}
          />,
        );

        const grid = container.querySelector(
          '[style*="grid-template-columns"]',
        ) as HTMLElement;
        const cols = grid.querySelectorAll(':scope > div');

        expect(grid.style.gridTemplateColumns).toBe(
          'repeat(3, minmax(0, 1fr))',
        );
        expect(cols).toHaveLength(3);
        expect(cols[1]).toHaveClass('smart:font-semibold');
        expect(cols[0]).not.toHaveAttribute('class');
      });

      it('should apply className on the wrapper', () => {
        const { container } = render(
          <SmartProgressBarsPreset
            className="my-extra-class"
            options={{ layout: 'progress-bar', value: 0 }}
          />,
        );

        expect(container.firstElementChild).toHaveClass(
          'smart:w-full',
          'my-extra-class',
        );
      });
    });

    describe('steps', () => {
      const steps = [
        { id: 'a', name: 'Account', status: 'complete' as const },
        { id: 'b', name: 'Profile', status: 'current' as const, index: '2' },
        { id: 'c', name: 'Done', status: 'upcoming' as const },
      ];

      it('should render one list item per step in vertical layouts', () => {
        const { container } = render(
          <SmartProgressBarsPreset
            options={{ layout: 'circles-with-text', steps }}
          />,
        );

        expect(container.querySelectorAll('li')).toHaveLength(3);
      });

      it('should render a check icon for a completed circle step', () => {
        const { container } = render(
          <SmartProgressBarsPreset options={{ layout: 'circles', steps }} />,
        );

        expect(container.querySelector('svg polyline')).toBeInTheDocument();
      });

      it('should number the other circle steps', () => {
        const { container } = render(
          <SmartProgressBarsPreset options={{ layout: 'circles', steps }} />,
        );

        const indexes = container.querySelectorAll('.smart\\:leading-none');

        expect(indexes).toHaveLength(2);
        expect(indexes[0]).toHaveTextContent('2');
        expect(indexes[1]).toHaveTextContent('3');
      });

      it('should style the current step name', () => {
        render(
          <SmartProgressBarsPreset
            options={{ layout: 'circles-with-text', steps }}
          />,
        );

        expect(screen.getByText('Profile')).toHaveClass('smart:text-blue-600');
      });

      it('should render no marker in the simple layout', () => {
        const { container } = render(
          <SmartProgressBarsPreset options={{ layout: 'simple', steps }} />,
        );

        expect(
          container.querySelector('.smart\\:rounded-full'),
        ).not.toBeInTheDocument();
      });

      it('should render bullet markers in the bullets layout', () => {
        const { container } = render(
          <SmartProgressBarsPreset options={{ layout: 'bullets', steps }} />,
        );

        expect(container.querySelectorAll('.smart\\:size-2\\.5')).toHaveLength(
          3,
        );
      });

      it('should render the step description', () => {
        render(
          <SmartProgressBarsPreset
            options={{
              steps: [{ id: 'a', name: 'Account', description: 'Your data' }],
            }}
          />,
        );

        expect(screen.getByText('Your data')).toHaveClass(
          'smart:text-gray-500',
        );
      });

      it('should call onStepClick when a step button is clicked', () => {
        const onStepClick = jest.fn();
        render(
          <SmartProgressBarsPreset
            options={{ layout: 'simple', steps }}
            onStepClick={onStepClick}
          />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Account' }));

        expect(onStepClick).toHaveBeenCalledWith({ stepId: 'a' });
      });

      it('should render a link for a step with an href', () => {
        render(
          <SmartProgressBarsPreset
            options={{
              layout: 'simple',
              steps: [
                {
                  id: 'a',
                  name: 'Account',
                  href: '/account',
                  status: 'current',
                },
              ],
            }}
          />,
        );

        const link = screen.getByRole('link', { name: 'Account' });

        expect(link).toHaveAttribute('href', '/account');
        expect(link).toHaveAttribute('aria-current', 'step');
      });

      it('should render connectors between the steps of horizontal circle layouts', () => {
        const { container } = render(
          <SmartProgressBarsPreset options={{ layout: 'circles', steps }} />,
        );

        const connectors = container.querySelectorAll('li[aria-hidden="true"]');

        expect(connectors).toHaveLength(2);
        expect(connectors[0]).toHaveClass('smart:bg-blue-600');
        expect(connectors[1]).toHaveClass('smart:bg-gray-200');
      });

      it('should not render connectors for panels', () => {
        const { container } = render(
          <SmartProgressBarsPreset options={{ layout: 'panels', steps }} />,
        );

        expect(
          container.querySelector('li[aria-hidden="true"]'),
        ).not.toBeInTheDocument();
      });

      it('should label the nav and apply className', () => {
        render(
          <SmartProgressBarsPreset
            className="my-extra-class"
            options={{ ariaLabel: 'Checkout', title: 'Steps', steps }}
          />,
        );

        const nav = screen.getByRole('navigation', { name: 'Checkout' });

        expect(nav).toHaveClass('smart:w-full', 'my-extra-class');
        expect(nav.querySelector('p')).toHaveTextContent('Steps');
      });
    });
  });
});
