import { render, screen } from '@testing-library/react';

import { SmartCardHeading } from './card-heading';
import { SmartCardHeadingProps } from './card-heading.types';
import { SmartCardHeadingPreset } from './preset/card-heading-preset';
import { getCardHeadingContainerClasses } from './preset/preset-classes';
import { SmartCardHeadingStandard } from './standard/card-heading-standard';
import { ICardHeadingOptions } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';

const slots: ICardHeadingOptions = {
  title: 'Job Postings',
  description: 'Currently open',
  avatarTpl: <img className="user-avatar" alt="" />,
  metaTpl: <span className="meta-tag">@user</span>,
  actionsTpl: <button className="action-btn">More</button>,
};

describe('@smartsoft001/react: SmartCardHeading', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartCardHeading options={{ title: 'Hello' }} />,
      );

      expect(container.querySelector('.content > h3')).toHaveTextContent(
        'Hello',
      );
    });

    it('should render the implementation registered as components.card-heading', () => {
      const Custom = ({ options }: SmartCardHeadingProps) => (
        <span data-testid="custom">{options?.title}</span>
      );

      render(
        <SmartProvider components={{ 'card-heading': Custom }}>
          <SmartCardHeading options={{ title: 'Hello' }} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('Hello');
    });

    it('should pass className to the implementation', () => {
      const { container } = render(
        <SmartCardHeading className="passed-class" />,
      );

      expect(container.firstElementChild).toHaveClass('passed-class');
    });
  });

  describe('standard', () => {
    it('should always render the content wrapper', () => {
      const { container } = render(<SmartCardHeadingStandard />);

      expect(container.querySelector('.content')).not.toBeNull();
    });

    it('should not render a heading without a title', () => {
      render(<SmartCardHeadingStandard />);

      expect(screen.queryByRole('heading')).toBeNull();
    });

    it('should not render any optional slot when none is given', () => {
      const { container } = render(<SmartCardHeadingStandard />);

      expect(
        container.querySelectorAll('.avatar, .meta, .actions, .description'),
      ).toHaveLength(0);
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartCardHeadingStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render the title as a heading', () => {
      render(<SmartCardHeadingStandard options={{ title: 'Job Postings' }} />);

      expect(
        screen.getByRole('heading', { level: 3, name: 'Job Postings' }),
      ).toBeInTheDocument();
    });

    it('should render the description', () => {
      render(<SmartCardHeadingStandard options={slots} />);

      expect(screen.getByText('Currently open')).toHaveClass('description');
    });

    it('should render avatarTpl in .avatar', () => {
      const { container } = render(
        <SmartCardHeadingStandard options={slots} />,
      );

      expect(container.querySelector('.avatar img.user-avatar')).not.toBeNull();
    });

    it('should render actionsTpl in .actions', () => {
      const { container } = render(
        <SmartCardHeadingStandard options={slots} />,
      );

      expect(
        container.querySelector('.actions button.action-btn'),
      ).not.toBeNull();
    });

    it('should render metaTpl inside the content area', () => {
      const { container } = render(
        <SmartCardHeadingStandard options={slots} />,
      );

      expect(
        container.querySelector('.content .meta span.meta-tag'),
      ).not.toBeNull();
    });
  });

  describe('preset', () => {
    function card(container: HTMLElement): HTMLElement {
      return container.querySelector('[data-role="card"]') as HTMLElement;
    }

    it('should fall back to the author variant without a presentation', () => {
      const { container } = render(
        <SmartCardHeadingPreset options={{ title: 'Job Postings' }} />,
      );

      expect(card(container)).toHaveClass(
        'smart:rounded-md',
        'smart:border-gray-300',
        'smart:dark:border-gray-600',
      );
    });

    it('should apply the author container classes', () => {
      const { container } = render(
        <SmartCardHeadingPreset
          options={{ title: 'A', presentation: { variant: 'author' } }}
        />,
      );

      expect(card(container)).toHaveClass(
        'smart:rounded-md',
        'smart:shadow-sm',
      );
    });

    it('should apply the stacked container classes', () => {
      const { container } = render(
        <SmartCardHeadingPreset
          options={{ title: 'A', presentation: { variant: 'stacked' } }}
        />,
      );

      expect(card(container)).toHaveClass('smart:block');
      expect(card(container)).not.toHaveClass('smart:rounded-md');
    });

    it('should apply the overlay container classes', () => {
      const { container } = render(
        <SmartCardHeadingPreset
          options={{ title: 'A', presentation: { variant: 'overlay' } }}
        />,
      );

      expect(card(container)).toHaveClass('smart:group', 'smart:bg-black');
    });

    it('should apply the outline container classes', () => {
      const { container } = render(
        <SmartCardHeadingPreset
          options={{ title: 'A', presentation: { variant: 'outline' } }}
        />,
      );

      expect(card(container)).toHaveClass('smart:group', 'smart:h-64');
    });

    it('should merge className into the card classes', () => {
      const { container } = render(
        <SmartCardHeadingPreset
          options={{ title: 'A' }}
          className="my-extra-class"
        />,
      );

      expect(card(container)).toHaveClass('my-extra-class', 'smart:rounded-md');
    });

    describe.each(['author', 'stacked', 'overlay', 'outline'] as const)(
      '%s variant slots',
      (variant) => {
        function renderVariant() {
          return render(
            <SmartCardHeadingPreset
              options={{ ...slots, presentation: { variant } }}
            />,
          );
        }

        it('should render the title', () => {
          const { container } = renderVariant();

          expect(
            container.querySelector('[data-role="title"]'),
          ).toHaveTextContent('Job Postings');
        });

        it('should render the description', () => {
          const { container } = renderVariant();

          expect(
            container.querySelector('[data-role="description"]'),
          ).toHaveTextContent('Currently open');
        });

        it('should render the avatar slot', () => {
          const { container } = renderVariant();

          expect(
            container.querySelector('[data-role="avatar"] img.user-avatar'),
          ).not.toBeNull();
        });

        it('should render the actions slot', () => {
          const { container } = renderVariant();

          expect(
            container.querySelector('[data-role="actions"] button.action-btn'),
          ).not.toBeNull();
        });
      },
    );

    it.each(['author', 'stacked', 'overlay'] as const)(
      'should render the meta slot in the %s variant',
      (variant) => {
        const { container } = render(
          <SmartCardHeadingPreset
            options={{ ...slots, presentation: { variant } }}
          />,
        );

        expect(
          container.querySelector('[data-role="meta"] span.meta-tag'),
        ).not.toBeNull();
      },
    );

    it('should render the meta slots as a description list in the author variant', () => {
      const { container } = render(<SmartCardHeadingPreset options={slots} />);

      expect(container.querySelector('[data-role="meta"]')?.tagName).toBe('DL');
    });

    it('should repeat the title for the hover face of the outline variant', () => {
      const { container } = render(
        <SmartCardHeadingPreset
          options={{ ...slots, presentation: { variant: 'outline' } }}
        />,
      );

      expect(
        container.querySelector('[data-role="title-hover"]'),
      ).toHaveTextContent('Job Postings');
    });

    it('should not render the slots that are not given', () => {
      const { container } = render(
        <SmartCardHeadingPreset options={{ title: 'A' }} />,
      );

      expect(
        container.querySelectorAll(
          '[data-role="avatar"], [data-role="meta"], [data-role="actions"], [data-role="description"]',
        ),
      ).toHaveLength(0);
    });
  });

  describe('getCardHeadingContainerClasses', () => {
    it('should default to the author recipe', () => {
      const result = getCardHeadingContainerClasses();

      expect(result).toBe(
        'smart:block smart:rounded-md smart:border smart:border-gray-300 smart:dark:border-gray-600 smart:p-4 smart:shadow-sm smart:sm:p-6',
      );
    });
  });
});
