import { render, screen } from '@testing-library/react';

import { SmartCard } from './card';
import { SmartCardVariantProps } from './card.types';
import { SmartCardPreset } from './preset/card-preset';
import { getCardBodyClasses } from './preset/preset-classes';
import { SmartCardStandard } from './standard/card-standard';
import { SmartProvider } from '../../providers/smart-provider';

function root(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement;
}

function sections(container: HTMLElement): HTMLElement[] {
  return Array.from(root(container).children) as HTMLElement[];
}

describe('@smartsoft001/react: SmartCard', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartCard>BODY</SmartCard>);

      expect(root(container)).toHaveClass(
        'smart:rounded-lg',
        'smart:shadow-sm',
      );
    });

    it('should render the children as the body', () => {
      render(
        <SmartCard>
          <div className="projected-body">BODY</div>
        </SmartCard>,
      );

      expect(screen.getByText('BODY')).toHaveClass('projected-body');
    });

    it('should render only the body without header and footer', () => {
      const { container } = render(<SmartCard>BODY</SmartCard>);

      expect(sections(container)).toHaveLength(1);
    });

    it('should render the header section when a header is given', () => {
      const { container } = render(
        <SmartCard header={<span>HEADER</span>}>BODY</SmartCard>,
      );

      expect(sections(container)[0]).toHaveTextContent('HEADER');
    });

    it('should render the footer section when a footer is given', () => {
      const { container } = render(
        <SmartCard footer={<span>FOOTER</span>}>BODY</SmartCard>,
      );

      expect(sections(container)[1]).toHaveTextContent('FOOTER');
    });

    it('should not render a section switched off by hasHeader / hasFooter', () => {
      render(
        <SmartCard
          header="HEADER"
          footer="FOOTER"
          hasHeader={false}
          hasFooter={false}
        >
          BODY
        </SmartCard>,
      );

      expect(screen.queryByText('HEADER')).toBeNull();
      expect(screen.queryByText('FOOTER')).toBeNull();
    });

    it('should render the title header when hasHeader is set without a header', () => {
      render(
        <SmartCard options={{ title: 'My Card Title' }} hasHeader={true}>
          BODY
        </SmartCard>,
      );

      expect(
        screen.getByRole('heading', { level: 3, name: 'My Card Title' }),
      ).toBeInTheDocument();
    });

    it('should not render a header section for a false header node', () => {
      const showActions = false;
      const { container } = render(
        <SmartCard header={showActions && <button>Edit</button>}>
          BODY
        </SmartCard>,
      );

      expect(sections(container)).toHaveLength(1);
    });

    it('should pass className to the implementation', () => {
      const { container } = render(
        <SmartCard className="passed-class">BODY</SmartCard>,
      );

      expect(root(container)).toHaveClass('passed-class');
    });

    it('should pass the slots and flags to the implementation registered as components.card', () => {
      const received: SmartCardVariantProps[] = [];
      const Custom = (props: SmartCardVariantProps) => {
        received.push(props);

        return <div className="injected-card">injected</div>;
      };

      render(
        <SmartProvider components={{ card: Custom }}>
          <SmartCard
            options={{ title: 'Hi' }}
            header="HEADER"
            footer="FOOTER"
            className="my-class"
          >
            BODY
          </SmartCard>
        </SmartProvider>,
      );

      expect(received[0]).toEqual({
        options: { title: 'Hi' },
        hasHeader: true,
        hasFooter: true,
        className: 'my-class',
        headerTpl: 'HEADER',
        bodyTpl: 'BODY',
        footerTpl: 'FOOTER',
      });
    });

    it('should not render the standard implementation when one is registered', () => {
      const Custom = () => <div className="injected-card">injected</div>;

      const { container } = render(
        <SmartProvider components={{ card: Custom }}>
          <SmartCard>BODY</SmartCard>
        </SmartProvider>,
      );

      expect(screen.queryByText('BODY')).toBeNull();
      expect(container.querySelector('.injected-card')).not.toBeNull();
    });
  });

  describe('standard', () => {
    function renderStandard(props: SmartCardVariantProps = {}) {
      return render(
        <SmartCardStandard
          bodyTpl="Body content"
          headerTpl="Header content"
          footerTpl="Footer content"
          hasHeader={false}
          hasFooter={false}
          {...props}
        />,
      );
    }

    it('should render the root with the card surface classes', () => {
      const { container } = renderStandard();

      expect(root(container)).toHaveClass(
        'smart:rounded-lg',
        'smart:bg-white',
        'smart:shadow-sm',
        'smart:overflow-hidden',
        'smart:dark:bg-gray-800/50',
      );
    });

    it('should append className to the root classes', () => {
      const { container } = renderStandard({ className: 'my-extra-class' });

      expect(root(container)).toHaveClass('my-extra-class');
    });

    it('should render the body', () => {
      const { container } = renderStandard();

      expect(root(container)).toHaveTextContent('Body content');
    });

    it('should use the body padding without the gray surface', () => {
      const { container } = renderStandard();

      expect(sections(container)[0]).toHaveClass('smart:px-4', 'smart:py-5');
      expect(sections(container)[0]).not.toHaveClass('smart:bg-gray-50');
    });

    it('should not render the header section when hasHeader is false', () => {
      const { container } = renderStandard();

      expect(root(container)).not.toHaveTextContent('Header content');
    });

    it('should render the header section when hasHeader is true', () => {
      const { container } = renderStandard({ hasHeader: true });

      expect(sections(container)[0]).toHaveTextContent('Header content');
      expect(sections(container)[0].className).toBe(
        'smart:px-4 smart:py-5 smart:sm:px-6',
      );
    });

    it('should render the header section when only headerTpl is given', () => {
      const { container } = render(
        <SmartCardStandard bodyTpl="Body" headerTpl="Header content" />,
      );

      expect(sections(container)[0]).toHaveTextContent('Header content');
    });

    it('should render the title from options in the header', () => {
      renderStandard({ hasHeader: true, options: { title: 'My Card Title' } });

      expect(
        screen.getByRole('heading', { level: 3, name: 'My Card Title' }),
      ).toHaveClass(
        'smart:text-base',
        'smart:font-semibold',
        'smart:text-gray-900',
        'smart:dark:text-white',
      );
    });

    it('should not render the footer section when hasFooter is false', () => {
      const { container } = renderStandard();

      expect(root(container)).not.toHaveTextContent('Footer content');
    });

    it('should render the footer section when hasFooter is true', () => {
      const { container } = renderStandard({ hasFooter: true });

      expect(sections(container)[1]).toHaveTextContent('Footer content');
      expect(sections(container)[1]).toHaveClass('smart:px-4', 'smart:py-4');
    });

    it('should not divide the sections without header and footer', () => {
      const { container } = renderStandard();

      expect(root(container)).not.toHaveClass('smart:divide-y');
    });

    it('should divide the sections when the header is shown', () => {
      const { container } = renderStandard({ hasHeader: true });

      expect(root(container)).toHaveClass(
        'smart:divide-y',
        'smart:divide-gray-200',
        'smart:dark:divide-white/10',
      );
    });

    it('should divide the sections when the footer is shown', () => {
      const { container } = renderStandard({ hasFooter: true });

      expect(root(container)).toHaveClass('smart:divide-y');
    });

    it('should not divide the sections with a gray footer', () => {
      const { container } = renderStandard({
        hasFooter: true,
        options: { grayFooter: true },
      });

      expect(root(container)).not.toHaveClass('smart:divide-y');
    });

    it('should apply the gray body surface when options.grayBody is set', () => {
      const { container } = renderStandard({ options: { grayBody: true } });

      expect(sections(container)[0]).toHaveClass(
        'smart:bg-gray-50',
        'smart:dark:bg-gray-800/50',
      );
    });

    it('should apply the gray footer surface when options.grayFooter is set', () => {
      const { container } = renderStandard({
        hasFooter: true,
        options: { grayFooter: true },
      });

      expect(sections(container)[1]).toHaveClass('smart:bg-gray-50');
    });
  });

  describe('preset', () => {
    function renderPreset(props: SmartCardVariantProps = {}) {
      return render(
        <SmartCardPreset
          bodyTpl="Body content"
          headerTpl="Header content"
          footerTpl="Footer content"
          hasHeader={false}
          hasFooter={false}
          {...props}
        />,
      );
    }

    it('should render the Preline card container classes', () => {
      const { container } = renderPreset();

      expect(root(container)).toHaveClass(
        'smart:rounded-xl',
        'smart:shadow-2xs',
        'smart:bg-white',
        'smart:border',
        'smart:dark:bg-gray-800',
        'smart:dark:border-gray-700',
      );
    });

    it('should not divide the sections with the shared dividers', () => {
      const { container } = renderPreset({ hasHeader: true });

      expect(root(container)).not.toHaveClass('smart:divide-y');
    });

    it('should render the body', () => {
      const { container } = renderPreset();

      expect(sections(container)[0]).toHaveTextContent('Body content');
      expect(sections(container)[0]).toHaveClass('smart:p-4');
    });

    it('should not render the header section when hasHeader is false', () => {
      const { container } = renderPreset();

      expect(root(container)).not.toHaveTextContent('Header content');
    });

    it('should render the header section with the Preline surface', () => {
      const { container } = renderPreset({ hasHeader: true });

      expect(sections(container)[0]).toHaveTextContent('Header content');
      expect(sections(container)[0]).toHaveClass(
        'smart:bg-gray-50',
        'smart:border-b',
      );
    });

    it('should render the title from options in the header', () => {
      renderPreset({ hasHeader: true, options: { title: 'My Card Title' } });

      expect(
        screen.getByRole('heading', { level: 3, name: 'My Card Title' }),
      ).toHaveClass(
        'smart:font-semibold',
        'smart:text-gray-900',
        'smart:dark:text-white',
      );
    });

    it('should not render the footer section when hasFooter is false', () => {
      const { container } = renderPreset();

      expect(root(container)).not.toHaveTextContent('Footer content');
    });

    it('should render the footer section when hasFooter is true', () => {
      const { container } = renderPreset({ hasFooter: true });

      expect(sections(container)[1]).toHaveTextContent('Footer content');
      expect(sections(container)[1]).toHaveClass('smart:border-t');
    });

    it('should apply the gray body surface when options.grayBody is set', () => {
      const { container } = renderPreset({ options: { grayBody: true } });

      expect(sections(container)[0]).toHaveClass('smart:bg-gray-50');
    });

    it('should apply the gray footer surface when options.grayFooter is set', () => {
      const { container } = renderPreset({
        hasFooter: true,
        options: { grayFooter: true },
      });

      expect(sections(container)[1]).toHaveClass(
        'smart:bg-gray-50',
        'smart:border-t',
      );
    });

    it('should apply className on the container', () => {
      const { container } = renderPreset({ className: 'my-extra-class' });

      expect(root(container)).toHaveClass('my-extra-class');
    });
  });

  describe('getCardBodyClasses', () => {
    it('should add the gray surface to the body padding', () => {
      const result = getCardBodyClasses(true);

      expect(result).toBe(
        'smart:p-4 smart:bg-gray-50 smart:dark:bg-gray-800/50',
      );
    });
  });
});
