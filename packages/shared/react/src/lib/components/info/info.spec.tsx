import { fireEvent, render, screen } from '@testing-library/react';

import { SmartInfo } from './info';
import { SmartInfoProps } from './info.types';
import { SmartInfoPreset } from './preset/info-preset';
import { getInfoTooltipClasses } from './preset/preset-classes';
import { SmartInfoStandard } from './standard/info-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartInfo', () => {
  const options = { text: 'test info text' };

  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      render(<SmartInfo options={options} />);

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByTestId('info-popover')).toHaveTextContent(
        'test info text',
      );
    });

    it('should render the implementation registered as components.info', () => {
      const Custom = ({ options: opts }: SmartInfoProps) => (
        <span data-testid="custom">{opts.text}</span>
      );

      render(
        <SmartProvider components={{ info: Custom }}>
          <SmartInfo options={options} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('test info text');
    });

    it('should pass className to the implementation', () => {
      const { container } = render(
        <SmartInfo options={options} className="passed-class" />,
      );

      expect(container.firstElementChild).toHaveClass('passed-class');
    });
  });

  describe('standard', () => {
    it('should render the info icon inside the toggle button', () => {
      render(<SmartInfoStandard options={options} />);

      expect(screen.getByRole('button').querySelector('svg')).toHaveClass(
        'smart:h-5',
        'smart:w-5',
      );
    });

    it('should not show the popover by default', () => {
      render(<SmartInfoStandard options={options} />);

      expect(screen.queryByTestId('info-popover')).toBeNull();
    });

    it('should show the popover when the icon is clicked', () => {
      render(<SmartInfoStandard options={options} />);

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByTestId('info-popover')).toBeInTheDocument();
    });

    it('should translate the text in the popover', () => {
      const translations = { 'help.vat': 'VAT is included' };
      render(
        <SmartProvider language="eng" translations={translations}>
          <SmartInfoStandard options={{ text: 'help.vat' }} />
        </SmartProvider>,
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByTestId('info-popover')).toHaveTextContent(
        'VAT is included',
      );
    });

    it('should translate the text with the default language', () => {
      render(<SmartInfoStandard options={{ text: 'confirm' }} />);

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByTestId('info-popover')).toHaveTextContent('potwierdź');
    });

    it('should close the popover when the icon is clicked again', () => {
      render(<SmartInfoStandard options={options} />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('button'));

      expect(screen.queryByTestId('info-popover')).toBeNull();
    });

    it('should close the popover when clicking outside', () => {
      render(<SmartInfoStandard options={options} />);
      fireEvent.click(screen.getByRole('button'));

      fireEvent.click(document.body);

      expect(screen.queryByTestId('info-popover')).toBeNull();
    });

    it('should keep the popover open when clicking inside it', () => {
      render(<SmartInfoStandard options={options} />);
      fireEvent.click(screen.getByRole('button'));

      fireEvent.click(screen.getByTestId('info-popover'));

      expect(screen.getByTestId('info-popover')).toBeInTheDocument();
    });

    it('should apply the relative inline-block container classes', () => {
      const { container } = render(<SmartInfoStandard options={options} />);

      expect(container.firstElementChild).toHaveClass(
        'smart:relative',
        'smart:inline-block',
      );
    });

    it('should append className to the container classes', () => {
      const { container } = render(
        <SmartInfoStandard options={options} className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    function renderPreset(
      props: Partial<Parameters<typeof SmartInfoPreset>[0]> = {},
    ) {
      const result = render(<SmartInfoPreset options={options} {...props} />);

      return {
        ...result,
        root: result.container.firstElementChild as HTMLElement,
        toggle: screen.getByRole('button', { name: 'More information' }),
      };
    }

    it('should render the circular icon toggle button', () => {
      const { toggle } = renderPreset();

      expect(toggle.querySelector('svg')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
      expect(toggle).toHaveClass('smart:rounded-full', 'smart:size-10');
    });

    it('should not show the tooltip by default', () => {
      renderPreset();

      expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('should show the tooltip on mouseenter', () => {
      const { root } = renderPreset();

      fireEvent.mouseEnter(root);

      expect(screen.getByRole('tooltip')).toHaveTextContent('test info text');
    });

    it('should hide the tooltip on mouseleave', () => {
      const { root } = renderPreset();
      fireEvent.mouseEnter(root);

      fireEvent.mouseLeave(root);

      expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('should show the tooltip on focus', () => {
      const { toggle } = renderPreset();

      fireEvent.focus(toggle);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should hide the tooltip on blur', () => {
      const { toggle } = renderPreset();
      fireEvent.focus(toggle);

      fireEvent.blur(toggle);

      expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('should translate the tooltip text', () => {
      const { toggle } = renderPreset({ options: { text: 'confirm' } });

      fireEvent.focus(toggle);

      expect(screen.getByRole('tooltip')).toHaveTextContent('potwierdź');
    });

    it('should size the tooltip to its text instead of its anchor', () => {
      const { toggle } = renderPreset();

      fireEvent.focus(toggle);

      expect(screen.getByRole('tooltip')).toHaveClass(
        'smart:w-max',
        'smart:max-w-xs',
      );
    });

    it('should default to the top placement classes', () => {
      const { toggle } = renderPreset();

      fireEvent.focus(toggle);

      expect(screen.getByRole('tooltip')).toHaveClass(
        'smart:bottom-full',
        'smart:bg-gray-900',
      );
    });

    it.each([
      ['bottom', 'smart:top-full'],
      ['left', 'smart:right-full'],
      ['right', 'smart:left-full'],
    ] as const)('should apply the %s placement classes', (placement, cls) => {
      const { toggle } = renderPreset({ placement });

      fireEvent.focus(toggle);

      expect(screen.getByRole('tooltip')).toHaveClass(cls);
    });

    it('should not apply the top placement classes for another placement', () => {
      const { toggle } = renderPreset({ placement: 'bottom' });

      fireEvent.focus(toggle);

      expect(screen.getByRole('tooltip')).not.toHaveClass('smart:bottom-full');
    });

    it('should describe the toggle by the tooltip while it is shown', () => {
      const { toggle } = renderPreset();

      fireEvent.focus(toggle);

      expect(toggle).toHaveAttribute(
        'aria-describedby',
        screen.getByRole('tooltip').id,
      );
    });

    it('should not set aria-describedby while the tooltip is hidden', () => {
      const { toggle } = renderPreset();

      expect(toggle).not.toHaveAttribute('aria-describedby');
    });

    it('should apply className on the container', () => {
      const { root } = renderPreset({ className: 'my-extra-class' });

      expect(root).toHaveClass(
        'smart:relative',
        'smart:inline-block',
        'my-extra-class',
      );
    });
  });

  describe('getInfoTooltipClasses', () => {
    it('should append the placement classes to the bubble recipe', () => {
      const result = getInfoTooltipClasses('right');

      expect(
        result.endsWith(
          'smart:left-full smart:top-1/2 smart:-translate-y-1/2 smart:ml-2',
        ),
      ).toBe(true);
    });
  });
});
