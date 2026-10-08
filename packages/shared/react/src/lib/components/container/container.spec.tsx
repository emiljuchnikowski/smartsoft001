import { render, screen } from '@testing-library/react';

import { SmartContainer } from './container';
import { SmartContainerProps } from './container.types';
import { SmartContainerPreset } from './preset/container-preset';
import { getContainerClasses } from './preset/preset-classes';
import { SmartContainerStandard } from './standard/container-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartContainer', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartContainer options={{ mode: 'constrained' }}>
          <span>x</span>
        </SmartContainer>,
      );

      expect(container.firstElementChild).toHaveAttribute(
        'data-mode',
        'constrained',
      );
    });

    it('should render the implementation registered as components.container', () => {
      const Custom = ({ children }: SmartContainerProps) => (
        <section data-testid="custom">{children}</section>
      );

      render(
        <SmartProvider components={{ container: Custom }}>
          <SmartContainer>Content</SmartContainer>
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('Content');
    });

    it('should pass className to the implementation', () => {
      const { container } = render(
        <SmartContainer className="passed-class">x</SmartContainer>,
      );

      expect(container.firstElementChild).toHaveClass('passed-class');
    });
  });

  describe('standard', () => {
    it('should render the children inside a wrapping div', () => {
      const { container } = render(
        <SmartContainerStandard>
          <span className="projected">x</span>
        </SmartContainerStandard>,
      );

      expect(
        container.querySelector(':scope > div > span.projected'),
      ).toHaveTextContent('x');
    });

    it('should omit data-mode and data-padding without options', () => {
      const { container } = render(
        <SmartContainerStandard>x</SmartContainerStandard>,
      );

      const div = container.firstElementChild;

      expect(div).not.toHaveAttribute('data-mode');
      expect(div).not.toHaveAttribute('data-padding');
    });

    it('should reflect options.mode in data-mode', () => {
      const { container } = render(
        <SmartContainerStandard options={{ mode: 'constrained' }}>
          x
        </SmartContainerStandard>,
      );

      expect(container.firstElementChild).toHaveAttribute(
        'data-mode',
        'constrained',
      );
    });

    it('should reflect options.padding in data-padding', () => {
      const { container } = render(
        <SmartContainerStandard options={{ padding: 'mobile' }}>
          x
        </SmartContainerStandard>,
      );

      expect(container.firstElementChild).toHaveAttribute(
        'data-padding',
        'mobile',
      );
    });

    it('should apply className on the div', () => {
      const { container } = render(
        <SmartContainerStandard className="my-extra-class">
          x
        </SmartContainerStandard>,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    function root(container: HTMLElement): HTMLElement {
      return container.querySelector('[data-role="container"]') as HTMLElement;
    }

    it('should render the children inside the root container', () => {
      const { container } = render(
        <SmartContainerPreset options={{ mode: 'container' }}>
          <p className="projected">Hello</p>
        </SmartContainerPreset>,
      );

      expect(root(container).querySelector('p.projected')).toHaveTextContent(
        'Hello',
      );
    });

    it('should apply the classes mapped from the options', () => {
      const { container } = render(
        <SmartContainerPreset
          options={{ mode: 'constrained', padding: 'always' }}
        >
          x
        </SmartContainerPreset>,
      );

      expect(root(container)).toHaveClass(
        'smart:max-w-5xl',
        'smart:px-4',
        'smart:lg:px-8',
      );
    });

    it('should merge className into the root classes', () => {
      const { container } = render(
        <SmartContainerPreset
          options={{ mode: 'container' }}
          className="my-extra-class"
        >
          x
        </SmartContainerPreset>,
      );

      expect(root(container)).toHaveClass('my-extra-class', 'smart:max-w-7xl');
    });

    it('should render the neutral full-width classes without options', () => {
      const { container } = render(
        <SmartContainerPreset>x</SmartContainerPreset>,
      );

      expect(root(container)).toHaveClass('smart:w-full');
    });
  });

  describe('getContainerClasses', () => {
    type Mode = 'container' | 'constrained' | 'full-width' | 'unset';
    type Padding = 'always' | 'mobile' | 'none' | 'unset';

    const MODE_BASE: Record<Mode, string> = {
      container: 'smart:mx-auto smart:max-w-7xl',
      constrained: 'smart:mx-auto smart:max-w-5xl',
      'full-width': 'smart:w-full',
      unset: 'smart:w-full',
    };

    const NARROW_BASE: Record<Mode, string> = {
      container: 'smart:mx-auto smart:max-w-3xl',
      constrained: 'smart:mx-auto smart:max-w-3xl',
      'full-width': 'smart:w-full smart:mx-auto smart:max-w-3xl',
      unset: 'smart:w-full smart:mx-auto smart:max-w-3xl',
    };

    const PAD: Record<Padding, string> = {
      always: 'smart:px-4 smart:sm:px-6 smart:lg:px-8',
      mobile: 'smart:px-4 smart:sm:px-0',
      none: '',
      unset: '',
    };

    const cases: Array<[Mode, Padding, boolean, string]> = [];

    for (const mode of Object.keys(MODE_BASE) as Mode[]) {
      for (const padding of Object.keys(PAD) as Padding[]) {
        for (const narrow of [false, true]) {
          const expected = [
            narrow ? NARROW_BASE[mode] : MODE_BASE[mode],
            PAD[padding],
          ]
            .filter(Boolean)
            .join(' ');

          cases.push([mode, padding, narrow, expected]);
        }
      }
    }

    it.each(cases)(
      'should map mode=%s padding=%s narrow=%s',
      (mode, padding, narrow, expected) => {
        const result = getContainerClasses(
          mode === 'unset' ? undefined : mode,
          padding === 'unset' ? undefined : padding,
          narrow,
        );

        expect(result).toBe(expected);
      },
    );

    it('should let narrow win over the mode max-width', () => {
      const result = getContainerClasses('container', 'none', true);

      expect(result).not.toContain('smart:max-w-7xl');
    });
  });
});
