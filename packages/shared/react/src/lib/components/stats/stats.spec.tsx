import { render, screen } from '@testing-library/react';

import { SmartStatsPreset } from './preset/stats-preset';
import { SmartStatsStandard } from './standard/stats-standard';
import { SmartStats } from './stats';
import { SmartStatsProps } from './stats.types';
import { IStatsOptions } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartStats', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartStats
          options={{ title: 'Hello', items: [] }}
          className="passed"
        />,
      );

      expect(container.querySelector('div.passed .stats h3')).toHaveTextContent(
        'Hello',
      );
    });

    it('should render the implementation registered as components.stats', () => {
      const Custom = ({ options, className }: SmartStatsProps) => (
        <div data-testid="custom" className={className}>
          {options?.title}
        </div>
      );

      render(
        <SmartProvider components={{ stats: Custom }}>
          <SmartStats
            options={{ title: 'Hello', items: [] }}
            className="passed"
          />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveClass('passed');
    });

    it('should not render the standard implementation when one is registered', () => {
      const Custom = () => <div data-testid="custom" />;

      const { container } = render(
        <SmartProvider components={{ stats: Custom }}>
          <SmartStats options={{ title: 'Hello', items: [] }} />
        </SmartProvider>,
      );

      expect(container.querySelector('dl')).toBeNull();
    });
  });

  describe('standard', () => {
    const revenue = { label: 'Revenue', value: '$405,091' };

    it('should always render the stats wrapper with a <dl>', () => {
      const { container } = render(<SmartStatsStandard />);

      expect(container.querySelector('.stats > dl')).toBeInTheDocument();
    });

    it('should not render any <.item> without items', () => {
      const { container } = render(<SmartStatsStandard />);

      expect(container.querySelectorAll('.item')).toHaveLength(0);
    });

    it('should not render any optional slot when none are provided', () => {
      const { container } = render(
        <SmartStatsStandard options={{ items: [revenue] }} />,
      );

      expect(
        container.querySelectorAll(
          '.title, .icon, .action, .previous, .change',
        ),
      ).toHaveLength(0);
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartStatsStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render <h3 class="title"> with options.title', () => {
      const { container } = render(
        <SmartStatsStandard
          options={{ title: 'Last 30 days', items: [revenue] }}
        />,
      );

      expect(container.querySelector('h3.title')).toHaveTextContent(
        'Last 30 days',
      );
    });

    it('should render <dt.label> with item.label', () => {
      const { container } = render(
        <SmartStatsStandard options={{ items: [revenue] }} />,
      );

      expect(container.querySelector('.item dt.label')).toHaveTextContent(
        'Revenue',
      );
    });

    it('should render <dd.value> with item.value', () => {
      const { container } = render(
        <SmartStatsStandard options={{ items: [revenue] }} />,
      );

      expect(container.querySelector('.item dd.value')).toHaveTextContent(
        '$405,091',
      );
    });

    it('should render <dd.previous> when item.previousValue is set', () => {
      const { container } = render(
        <SmartStatsStandard
          options={{ items: [{ ...revenue, previousValue: '$365,000' }] }}
        />,
      );

      expect(container.querySelector('.item dd.previous')).toHaveTextContent(
        '$365,000',
      );
    });

    it('should render <dd.previous> when item.previousValue is 0', () => {
      const { container } = render(
        <SmartStatsStandard
          options={{ items: [{ ...revenue, previousValue: 0 }] }}
        />,
      );

      expect(container.querySelector('.item dd.previous')).toHaveTextContent(
        '0',
      );
    });

    it('should render <dd.change> with item.change', () => {
      const { container } = render(
        <SmartStatsStandard
          options={{ items: [{ ...revenue, change: '+4.75%', trend: 'up' }] }}
        />,
      );

      expect(container.querySelector('.item dd.change')).toHaveTextContent(
        '+4.75%',
      );
    });

    it('should set data-trend on <dd.change> from item.trend', () => {
      const { container } = render(
        <SmartStatsStandard
          options={{ items: [{ ...revenue, change: '+4.75%', trend: 'up' }] }}
        />,
      );

      expect(container.querySelector('.item dd.change')).toHaveAttribute(
        'data-trend',
        'up',
      );
    });

    it('should not set data-trend without item.trend', () => {
      const { container } = render(
        <SmartStatsStandard
          options={{ items: [{ ...revenue, change: '+4.75%' }] }}
        />,
      );

      expect(container.querySelector('.item dd.change')).not.toHaveAttribute(
        'data-trend',
      );
    });

    it('should render one <.item> per items entry', () => {
      const { container } = render(
        <SmartStatsStandard
          options={{
            items: [
              revenue,
              { label: 'Overdue invoices', value: '$12,787' },
              { label: 'Outstanding invoices', value: '$245,988' },
              { label: 'Expenses', value: '$30,156' },
            ],
          }}
        />,
      );

      expect(container.querySelectorAll('.item')).toHaveLength(4);
    });

    it('should render iconTpl inside <.icon>', () => {
      const { container } = render(
        <SmartStatsStandard
          options={{
            items: [{ ...revenue, iconTpl: <svg className="custom-icon" /> }],
          }}
        />,
      );

      expect(
        container.querySelector('.item .icon svg.custom-icon'),
      ).toBeInTheDocument();
    });

    it('should render actionTpl inside <.action>', () => {
      const { container } = render(
        <SmartStatsStandard
          options={{
            items: [
              {
                ...revenue,
                actionTpl: <button className="action-btn">View</button>,
              },
            ],
          }}
        />,
      );

      expect(
        container.querySelector('.item .action button.action-btn'),
      ).toBeInTheDocument();
    });

    it('should set aria-label on <.item> from item.ariaLabel', () => {
      const { container } = render(
        <SmartStatsStandard
          options={{
            items: [{ ...revenue, ariaLabel: 'Revenue: $405,091' }],
          }}
        />,
      );

      expect(container.querySelector('.item')).toHaveAttribute(
        'aria-label',
        'Revenue: $405,091',
      );
    });

    it('should not set aria-label on <.item> without item.ariaLabel', () => {
      const { container } = render(
        <SmartStatsStandard options={{ items: [revenue] }} />,
      );

      expect(container.querySelector('.item')).not.toHaveAttribute(
        'aria-label',
      );
    });
  });

  describe('preset', () => {
    const OPTIONS: IStatsOptions = {
      items: [
        {
          label: 'Accuracy rate',
          value: '99.95%',
          previousValue: 'in fulfilling orders',
        },
        { label: 'Startup businesses', value: '2,000+' },
        { label: 'Happy customer', value: '85%' },
      ],
    };

    function grid(container: HTMLElement): Element {
      return container.querySelectorAll('div')[1];
    }

    it('should render one block per item', () => {
      const { container } = render(<SmartStatsPreset options={OPTIONS} />);

      expect(grid(container).children).toHaveLength(3);
    });

    it('should render the label of an item in an <h4>', () => {
      const { container } = render(<SmartStatsPreset options={OPTIONS} />);

      expect(
        Array.from(container.querySelectorAll('h4')).map((h) => h.textContent),
      ).toEqual(['Accuracy rate', 'Startup businesses', 'Happy customer']);
    });

    it('should render the value of an item', () => {
      const { container } = render(<SmartStatsPreset options={OPTIONS} />);

      expect(container.querySelector('h4 + p')).toHaveTextContent('99.95%');
    });

    it('should render the previousValue as a muted sub-line', () => {
      const { container } = render(<SmartStatsPreset options={OPTIONS} />);

      expect(
        container.querySelector('p.smart\\:text-gray-500'),
      ).toHaveTextContent('in fulfilling orders');
    });

    it('should default to three columns', () => {
      const { container } = render(<SmartStatsPreset options={OPTIONS} />);

      expect(grid(container)).toHaveClass('smart:lg:grid-cols-3');
    });

    it('should apply the columns count from options', () => {
      const { container } = render(
        <SmartStatsPreset options={{ ...OPTIONS, columns: 4 }} />,
      );

      expect(grid(container)).toHaveClass('smart:lg:grid-cols-4');
    });

    it('should render the title in an <h2>', () => {
      const { container } = render(
        <SmartStatsPreset options={{ ...OPTIONS, title: 'Our numbers' }} />,
      );

      expect(container.querySelector('h2')).toHaveTextContent('Our numbers');
    });

    it('should not render the title without options.title', () => {
      const { container } = render(<SmartStatsPreset options={OPTIONS} />);

      expect(container.querySelector('h2')).toBeNull();
    });

    it.each([
      ['up', 'smart:text-green-800'],
      ['down', 'smart:text-red-800'],
      ['neutral', 'smart:text-gray-800'],
      [undefined, 'smart:text-gray-800'],
    ] as const)(
      'should colour the change badge for the %s trend',
      (trend, cls) => {
        const { container } = render(
          <SmartStatsPreset
            options={{
              items: [
                { label: 'Conversion', value: '92%', change: '+7%', trend },
              ],
            }}
          />,
        );

        expect(container.querySelector('p span')).toHaveClass(cls);
      },
    );

    it('should render the change text in the badge', () => {
      const { container } = render(
        <SmartStatsPreset
          options={{
            items: [{ label: 'Conversion', value: '92%', change: '+7%' }],
          }}
        />,
      );

      expect(container.querySelector('p span')).toHaveTextContent('+7%');
    });

    it('should render iconTpl in the icon wrap', () => {
      const { container } = render(
        <SmartStatsPreset
          options={{
            items: [
              {
                label: 'Users',
                value: '10',
                iconTpl: <svg className="icon" />,
              },
            ],
          }}
        />,
      );

      expect(
        container.querySelector('.smart\\:shrink-0 svg.icon'),
      ).toBeInTheDocument();
    });

    it('should render actionTpl in the action zone', () => {
      const { container } = render(
        <SmartStatsPreset
          options={{
            items: [
              {
                label: 'Users',
                value: '10',
                actionTpl: <button className="action-btn">View</button>,
              },
            ],
          }}
        />,
      );

      expect(
        container.querySelector('.smart\\:mt-3 button.action-btn'),
      ).toBeInTheDocument();
    });

    it('should set aria-label from the item', () => {
      render(
        <SmartStatsPreset
          options={{
            items: [{ label: 'Users', value: '10', ariaLabel: 'Active users' }],
          }}
        />,
      );

      expect(screen.getByLabelText('Active users')).toBeInTheDocument();
    });

    it('should merge className onto the root', () => {
      const { container } = render(
        <SmartStatsPreset options={OPTIONS} className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass(
        'my-extra-class',
        'smart:max-w-5xl',
      );
    });
  });
});
