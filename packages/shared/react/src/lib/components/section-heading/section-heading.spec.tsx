import { render, screen } from '@testing-library/react';

import { SmartSectionHeadingPreset } from './preset/section-heading-preset';
import { SmartSectionHeading } from './section-heading';
import { SmartSectionHeadingProps } from './section-heading.types';
import { SmartSectionHeadingStandard } from './standard/section-heading-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartSectionHeading', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartSectionHeading options={{ title: 'Hello' }} className="passed" />,
      );

      expect(
        container.querySelector('div.passed .header h3'),
      ).toHaveTextContent('Hello');
    });

    it('should render the implementation registered as components["section-heading"]', () => {
      const Custom = ({ options, className }: SmartSectionHeadingProps) => (
        <div data-testid="custom" className={className}>
          {options?.title}
        </div>
      );

      render(
        <SmartProvider components={{ 'section-heading': Custom }}>
          <SmartSectionHeading
            options={{ title: 'Hello' }}
            className="passed"
          />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveClass('passed');
    });

    it('should not render the standard implementation when one is registered', () => {
      const Custom = () => <div data-testid="custom" />;

      const { container } = render(
        <SmartProvider components={{ 'section-heading': Custom }}>
          <SmartSectionHeading options={{ title: 'Hello' }} />
        </SmartProvider>,
      );

      expect(container.querySelector('.header')).toBeNull();
    });
  });

  describe('standard', () => {
    it('should always render the header wrapper', () => {
      const { container } = render(<SmartSectionHeadingStandard />);

      expect(
        container.querySelector('.header .title-block'),
      ).toBeInTheDocument();
    });

    it('should not render <h3> when title is missing', () => {
      const { container } = render(<SmartSectionHeadingStandard />);

      expect(container.querySelector('h3')).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const { container } = render(
        <SmartSectionHeadingStandard options={{}} />,
      );

      expect(
        container.querySelectorAll(
          '.actions, .tabs, .input-group, .badge, .description, .label',
        ),
      ).toHaveLength(0);
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartSectionHeadingStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render <h3> with options.title', () => {
      const { container } = render(
        <SmartSectionHeadingStandard options={{ title: 'Applicants' }} />,
      );

      expect(container.querySelector('h3')).toHaveTextContent('Applicants');
    });

    it('should render the label inside <h3>', () => {
      const { container } = render(
        <SmartSectionHeadingStandard
          options={{ title: 'Applicants', label: 'in Engineering' }}
        />,
      );

      expect(container.querySelector('h3 span.label')).toHaveTextContent(
        'in Engineering',
      );
    });

    it('should separate the title and the label with a space', () => {
      const { container } = render(
        <SmartSectionHeadingStandard
          options={{ title: 'Applicants', label: 'in Engineering' }}
        />,
      );

      expect(container.querySelector('h3')).toHaveTextContent(
        'Applicants in Engineering',
      );
    });

    it('should render the description', () => {
      const { container } = render(
        <SmartSectionHeadingStandard
          options={{
            title: 'Applicants',
            description: 'Users currently active',
          }}
        />,
      );

      expect(container.querySelector('p.description')).toHaveTextContent(
        'Users currently active',
      );
    });

    it.each([
      ['badgeTpl', '.header > .badge'],
      ['inputGroupTpl', '.header > .input-group'],
      ['actionsTpl', '.header > .actions'],
      ['tabsTpl', ':scope > div > .tabs'],
    ])('should render %s in %s', (key, selector) => {
      const { container } = render(
        <SmartSectionHeadingStandard
          options={{ [key]: <span className="slot-content">content</span> }}
        />,
      );

      expect(
        container.querySelector(`${selector} span.slot-content`),
      ).toBeInTheDocument();
    });
  });

  describe('preset', () => {
    function query(container: HTMLElement, selector: string) {
      return container.querySelector(selector);
    }

    function gridRoles(container: HTMLElement): (string | null)[] {
      return Array.from(
        container.querySelector('[data-role="grid"]')?.children ?? [],
      ).map((child) => child.getAttribute('data-role'));
    }

    const imageTpl = <img className="hero-img" src="/hero.png" alt="" />;

    it('should default to the "half" layout', () => {
      const { container } = render(
        <SmartSectionHeadingPreset options={{ title: 'Half' }} />,
      );

      expect(query(container, '[data-role="grid"]')).toHaveClass(
        'smart:md:grid-cols-2',
      );
    });

    it.each([
      ['half', 'smart:md:grid-cols-2'],
      ['narrow', 'smart:md:grid-cols-4'],
      ['wide', 'smart:md:grid-cols-4'],
      ['vertical', 'smart:space-y-4'],
    ] as const)('should lay the "%s" layout out with %s', (layout, cls) => {
      const { container } = render(
        <SmartSectionHeadingPreset
          options={{ title: 'T', presentation: { layout } }}
        />,
      );

      expect(query(container, '[data-role="grid"]')).toHaveClass(cls);
    });

    it('should not use a grid for the "vertical" layout', () => {
      const { container } = render(
        <SmartSectionHeadingPreset
          options={{ title: 'T', presentation: { layout: 'vertical' } }}
        />,
      );

      expect(query(container, '[data-role="grid"]')?.className).not.toContain(
        'smart:grid-cols',
      );
    });

    it('should span the text over one column for the "narrow" layout', () => {
      const { container } = render(
        <SmartSectionHeadingPreset
          options={{ title: 'T', presentation: { layout: 'narrow' } }}
        />,
      );

      expect(query(container, '[data-role="text"]')).toHaveClass(
        'smart:md:col-span-1',
      );
    });

    it('should render the title in an <h2>', () => {
      const { container } = render(
        <SmartSectionHeadingPreset options={{ title: 'Content title' }} />,
      );

      expect(query(container, '[data-role="text"] h2')).toHaveTextContent(
        'Content title',
      );
    });

    it('should render the description in a <p>', () => {
      const { container } = render(
        <SmartSectionHeadingPreset
          options={{ title: 'T', description: 'Some description' }}
        />,
      );

      expect(query(container, '[data-role="text"] p')).toHaveTextContent(
        'Some description',
      );
    });

    it('should render the label in the eyebrow row', () => {
      const { container } = render(
        <SmartSectionHeadingPreset
          options={{ title: 'T', label: 'New feature' }}
        />,
      );

      expect(query(container, '[data-role="eyebrow"]')).toHaveTextContent(
        'New feature',
      );
    });

    it('should render badgeTpl in the eyebrow row', () => {
      const { container } = render(
        <SmartSectionHeadingPreset
          options={{
            title: 'T',
            badgeTpl: <span className="badge-pill">Beta</span>,
          }}
        />,
      );

      expect(
        query(container, '[data-role="eyebrow"] span.badge-pill'),
      ).toBeInTheDocument();
    });

    it('should not render the eyebrow row without label and badge', () => {
      const { container } = render(
        <SmartSectionHeadingPreset options={{ title: 'T' }} />,
      );

      expect(query(container, '[data-role="eyebrow"]')).toBeNull();
    });

    it('should render actionsTpl in the actions row', () => {
      const { container } = render(
        <SmartSectionHeadingPreset
          options={{
            title: 'T',
            actionsTpl: <button className="action-btn">Learn more</button>,
          }}
        />,
      );

      expect(
        query(container, '[data-role="actions"] button.action-btn'),
      ).toBeInTheDocument();
    });

    it('should not render the image zone without imageTpl', () => {
      const { container } = render(
        <SmartSectionHeadingPreset options={{ title: 'T' }} />,
      );

      expect(query(container, '[data-role="image"]')).toBeNull();
    });

    it('should render imageTpl in the image zone', () => {
      const { container } = render(
        <SmartSectionHeadingPreset options={{ title: 'T', imageTpl }} />,
      );

      expect(
        query(container, '[data-role="image"] img.hero-img'),
      ).toBeInTheDocument();
    });

    it('should render the image before the text for the "wide" layout', () => {
      const { container } = render(
        <SmartSectionHeadingPreset
          options={{ title: 'T', imageTpl, presentation: { layout: 'wide' } }}
        />,
      );

      expect(gridRoles(container)).toEqual(['image', 'text']);
    });

    it('should render the text before the image for the "half" layout', () => {
      const { container } = render(
        <SmartSectionHeadingPreset
          options={{ title: 'T', imageTpl, presentation: { layout: 'half' } }}
        />,
      );

      expect(gridRoles(container)).toEqual(['text', 'image']);
    });

    it('should merge className onto the section', () => {
      const { container } = render(
        <SmartSectionHeadingPreset
          options={{ title: 'T' }}
          className="my-extra-class"
        />,
      );

      expect(query(container, '[data-role="section"]')).toHaveClass(
        'my-extra-class',
      );
    });
  });
});
