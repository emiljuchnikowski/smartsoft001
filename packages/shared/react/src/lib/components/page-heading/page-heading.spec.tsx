import { fireEvent, render, screen } from '@testing-library/react';

import { SmartPageHeading } from './page-heading';
import { SmartPageHeadingProps } from './page-heading.types';
import { SmartPageHeadingPreset } from './preset/page-heading-preset';
import { SmartPageHeadingStandard } from './standard/page-heading-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartPageHeading', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartPageHeading options={{ title: 'Hello' }} className="passed" />,
      );

      expect(
        container.querySelector('div.passed > header h1'),
      ).toHaveTextContent('Hello');
    });

    it('should render the implementation registered as components["page-heading"]', () => {
      const Custom = ({ options, className }: SmartPageHeadingProps) => (
        <div data-testid="custom" className={className}>
          {options?.title}
        </div>
      );

      render(
        <SmartProvider components={{ 'page-heading': Custom }}>
          <SmartPageHeading options={{ title: 'Hello' }} className="passed" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveClass('passed');
    });

    it('should not render the standard implementation when one is registered', () => {
      const Custom = () => <div data-testid="custom" />;

      const { container } = render(
        <SmartProvider components={{ 'page-heading': Custom }}>
          <SmartPageHeading options={{ title: 'Hello' }} />
        </SmartProvider>,
      );

      expect(container.querySelector('header')).toBeNull();
    });
  });

  describe('standard', () => {
    it('should always render a <header>', () => {
      const { container } = render(<SmartPageHeadingStandard />);

      expect(container.querySelector('header')).toBeInTheDocument();
    });

    it('should not render <h1> when title is missing', () => {
      const { container } = render(<SmartPageHeadingStandard />);

      expect(container.querySelector('h1')).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const { container } = render(<SmartPageHeadingStandard options={{}} />);

      expect(
        container.querySelectorAll(
          'nav.breadcrumbs, .banner, .avatar, .logo, .meta, .stats, .actions, .filters, .subtitle',
        ),
      ).toHaveLength(0);
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartPageHeadingStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render <h1> with options.title', () => {
      const { container } = render(
        <SmartPageHeadingStandard options={{ title: 'Back End Developer' }} />,
      );

      expect(container.querySelector('h1')).toHaveTextContent(
        'Back End Developer',
      );
    });

    it('should render the subtitle when options.subtitle is provided', () => {
      const { container } = render(
        <SmartPageHeadingStandard
          options={{ title: 'Title', subtitle: 'Engineering' }}
        />,
      );

      expect(container.querySelector('p.subtitle')).toHaveTextContent(
        'Engineering',
      );
    });

    it('should render breadcrumbsTpl in <nav.breadcrumbs>', () => {
      const { container } = render(
        <SmartPageHeadingStandard
          options={{ breadcrumbsTpl: <a className="crumb">Home</a> }}
        />,
      );

      expect(
        container.querySelector('nav.breadcrumbs a.crumb'),
      ).toBeInTheDocument();
    });

    it('should render bannerTpl in <.banner> outside the header', () => {
      const { container } = render(
        <SmartPageHeadingStandard
          options={{ bannerTpl: <img className="banner-img" alt="" /> }}
        />,
      );

      expect(
        container.querySelector(':scope > div > .banner img.banner-img'),
      ).toBeInTheDocument();
    });

    it.each([
      ['avatarTpl', 'avatar'],
      ['logoTpl', 'logo'],
      ['metaTpl', 'meta'],
      ['statsTpl', 'stats'],
      ['actionsTpl', 'actions'],
      ['filtersTpl', 'filters'],
    ])('should render %s in <header .%s>', (key, slot) => {
      const { container } = render(
        <SmartPageHeadingStandard
          options={{ [key]: <span className="slot-content">content</span> }}
        />,
      );

      expect(
        container.querySelector(`header .${slot} span.slot-content`),
      ).toBeInTheDocument();
    });
  });

  describe('preset', () => {
    const logoTpl = <span className="logo-content">Logo</span>;
    const navTpl = (
      <ul className="nav-content">
        <li>Home</li>
      </ul>
    );
    const actionsTpl = <a className="actions-content">Sign in</a>;
    const avatarTpl = <img className="avatar-content" alt="me" />;

    function role(container: HTMLElement, name: string): HTMLElement | null {
      return container.querySelector(`[data-role="${name}"]`);
    }

    it('should render the header', () => {
      const { container } = render(
        <SmartPageHeadingPreset options={{ title: 'Acme' }} />,
      );

      expect(role(container, 'header')).toHaveClass('smart:bg-white');
    });

    it('should default to links-left (gap-8 bar)', () => {
      const { container } = render(
        <SmartPageHeadingPreset options={{ logoTpl, navTpl, actionsTpl }} />,
      );

      expect(container.querySelector('.smart\\:gap-8')).toBeInTheDocument();
    });

    it('should render the logo, nav and actions zones for links-left', () => {
      const { container } = render(
        <SmartPageHeadingPreset options={{ logoTpl, navTpl, actionsTpl }} />,
      );

      expect(
        ['logo', 'nav', 'actions'].map((name) => !!role(container, name)),
      ).toEqual([true, true, true]);
    });

    it('should center the nav for links-center', () => {
      const { container } = render(
        <SmartPageHeadingPreset
          options={{
            presentation: { layout: 'links-center' },
            logoTpl,
            navTpl,
            actionsTpl,
          }}
        />,
      );

      expect(
        container.querySelector(
          '.smart\\:md\\:justify-center [data-role="nav"]',
        ),
      ).toBeInTheDocument();
    });

    it('should not use the gap-8 bar for links-center', () => {
      const { container } = render(
        <SmartPageHeadingPreset
          options={{ presentation: { layout: 'links-center' }, logoTpl }}
        />,
      );

      expect(container.querySelector('.smart\\:gap-8')).toBeNull();
    });

    it('should group nav and actions on the right for links-right', () => {
      const { container } = render(
        <SmartPageHeadingPreset
          options={{
            presentation: { layout: 'links-right' },
            logoTpl,
            navTpl,
            actionsTpl,
          }}
        />,
      );

      expect(
        container.querySelector('.smart\\:md\\:gap-12 [data-role="actions"]'),
      ).toBeInTheDocument();
    });

    it('should not render the avatar zone for links-right', () => {
      const { container } = render(
        <SmartPageHeadingPreset
          options={{ presentation: { layout: 'links-right' }, avatarTpl }}
        />,
      );

      expect(role(container, 'avatar')).toBeNull();
    });

    it('should render the avatar zone for the user layout', () => {
      const { container } = render(
        <SmartPageHeadingPreset
          options={{ presentation: { layout: 'user' }, navTpl, avatarTpl }}
        />,
      );

      expect(
        container.querySelector('.smart\\:md\\:gap-12 [data-role="avatar"]'),
      ).toBeInTheDocument();
    });

    it('should not render the actions zone for the user layout', () => {
      const { container } = render(
        <SmartPageHeadingPreset
          options={{ presentation: { layout: 'user' }, actionsTpl }}
        />,
      );

      expect(role(container, 'actions')).toBeNull();
    });

    it('should render logoTpl in the logo zone', () => {
      const { container } = render(
        <SmartPageHeadingPreset options={{ logoTpl, title: 'Acme' }} />,
      );

      expect(
        role(container, 'logo')?.querySelector('.logo-content'),
      ).toBeInTheDocument();
    });

    it('should fall back to the title text without logoTpl', () => {
      const { container } = render(
        <SmartPageHeadingPreset options={{ title: 'Dashboard' }} />,
      );

      expect(role(container, 'logo')?.textContent?.trim()).toBe('Dashboard');
    });

    it('should hide the mobile panel by default', () => {
      const { container } = render(
        <SmartPageHeadingPreset options={{ navTpl, actionsTpl }} />,
      );

      expect(role(container, 'mobile-panel')).toBeNull();
    });

    it('should reveal the nav and actions in the mobile panel on hamburger click', () => {
      const { container } = render(
        <SmartPageHeadingPreset options={{ navTpl, actionsTpl }} />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));

      const panel = role(container, 'mobile-panel');
      expect([
        !!panel?.querySelector('.nav-content'),
        !!panel?.querySelector('.smart\\:mt-4 .actions-content'),
      ]).toEqual([true, true]);
    });

    it('should close the mobile panel on a second hamburger click', () => {
      const { container } = render(
        <SmartPageHeadingPreset options={{ navTpl }} />,
      );
      const hamburger = screen.getByRole('button', { name: 'Toggle menu' });

      fireEvent.click(hamburger);
      fireEvent.click(hamburger);

      expect(role(container, 'mobile-panel')).toBeNull();
    });

    it('should merge className onto the header', () => {
      const { container } = render(
        <SmartPageHeadingPreset
          options={{ title: 'Acme' }}
          className="my-extra-class"
        />,
      );

      expect(role(container, 'header')).toHaveClass(
        'my-extra-class',
        'smart:bg-white',
      );
    });
  });
});
