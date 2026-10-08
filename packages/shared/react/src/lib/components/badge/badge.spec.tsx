import { fireEvent, render, screen } from '@testing-library/react';

import { SmartBadge } from './badge';
import { SmartBadgeProps } from './badge.types';
import { SmartBadgePreset } from './preset/badge-preset';
import { SmartBadgeStandard } from './standard/badge-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartBadge', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartBadge text="Badge" color="red" />);

      expect(container.firstElementChild).toHaveAttribute('data-color', 'red');
    });

    it('should render the implementation registered as components.badge', () => {
      render(
        <SmartProvider components={{ badge: SmartBadgePreset }}>
          <SmartBadge text="Badge" color="red" options={{ variant: 'solid' }} />
        </SmartProvider>,
      );

      expect(screen.getByText('Badge')).toHaveClass('smart:bg-red-600');
    });

    it('should pass onRemoved to the registered implementation', () => {
      const onRemoved = jest.fn();
      const Custom = (props: SmartBadgeProps) => (
        <button type="button" onClick={props.onRemoved}>
          {props.text}
        </button>
      );
      render(
        <SmartProvider components={{ badge: Custom }}>
          <SmartBadge text="Custom" onRemoved={onRemoved} />
        </SmartProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Custom' }));

      expect(onRemoved).toHaveBeenCalledTimes(1);
    });
  });

  describe('standard', () => {
    it('should render the text inside the badge', () => {
      const { container } = render(<SmartBadgeStandard text="Badge" />);

      expect(container.querySelector('.smart-badge-text')).toHaveTextContent(
        'Badge',
      );
    });

    it('should not render the dot when withDot is not set', () => {
      const { container } = render(<SmartBadgeStandard text="Badge" />);

      expect(container.querySelector('.smart-badge-dot')).toBeNull();
    });

    it('should render a hidden dot when options.withDot is true', () => {
      const { container } = render(
        <SmartBadgeStandard text="Badge" options={{ withDot: true }} />,
      );

      expect(container.querySelector('.smart-badge-dot')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });

    it('should not render the remove button when withRemove is not set', () => {
      render(<SmartBadgeStandard text="Badge" />);

      expect(screen.queryByRole('button')).toBeNull();
    });

    it('should call onRemoved when the remove button is clicked', () => {
      const onRemoved = jest.fn();
      render(
        <SmartBadgeStandard
          text="Badge"
          options={{ withRemove: true }}
          onRemoved={onRemoved}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

      expect(onRemoved).toHaveBeenCalledTimes(1);
    });

    it('should expose the default color, size, variant and pill as data attributes', () => {
      const { container } = render(<SmartBadgeStandard text="Badge" />);

      const badge = container.firstElementChild;
      expect(badge).toHaveAttribute('data-color', 'gray');
      expect(badge).toHaveAttribute('data-size', 'md');
      expect(badge).toHaveAttribute('data-variant', 'soft');
      expect(badge).toHaveAttribute('data-pill', 'true');
    });

    it('should reflect color, size, variant and pill in the data attributes', () => {
      const { container } = render(
        <SmartBadgeStandard
          text="Badge"
          color="red"
          size="sm"
          options={{ variant: 'outline', pill: false }}
        />,
      );

      const badge = container.firstElementChild;
      expect(badge).toHaveAttribute('data-color', 'red');
      expect(badge).toHaveAttribute('data-size', 'sm');
      expect(badge).toHaveAttribute('data-variant', 'outline');
      expect(badge).toHaveAttribute('data-pill', 'false');
    });

    it('should apply className on the root span', () => {
      const { container } = render(
        <SmartBadgeStandard text="Badge" className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    it('should default to the soft gray md pill', () => {
      const { container } = render(<SmartBadgePreset text="Badge" />);

      expect(container.firstElementChild).toHaveClass(
        'smart:bg-gray-100',
        'smart:rounded-full',
        'smart:px-3',
      );
    });

    it('should render the text', () => {
      const { container } = render(<SmartBadgePreset text="Badge" />);

      expect(container.firstElementChild).toHaveTextContent('Badge');
    });

    it('should apply the solid variant classes', () => {
      const { container } = render(
        <SmartBadgePreset
          text="Badge"
          color="red"
          options={{ variant: 'solid' }}
        />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:bg-red-600',
        'smart:text-white',
      );
    });

    it('should apply the soft variant classes', () => {
      const { container } = render(
        <SmartBadgePreset
          text="Badge"
          color="green"
          options={{ variant: 'soft' }}
        />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:bg-green-100',
        'smart:text-green-800',
      );
    });

    it('should apply the outline variant classes', () => {
      const { container } = render(
        <SmartBadgePreset
          text="Badge"
          color="blue"
          options={{ variant: 'outline' }}
        />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:border',
        'smart:border-blue-500',
        'smart:text-blue-700',
      );
    });

    it('should apply the sm size classes', () => {
      const { container } = render(<SmartBadgePreset text="Badge" size="sm" />);

      expect(container.firstElementChild).toHaveClass(
        'smart:px-2',
        'smart:py-0.5',
      );
    });

    it('should render square corners when pill is false', () => {
      const { container } = render(
        <SmartBadgePreset text="Badge" options={{ pill: false }} />,
      );

      expect(container.firstElementChild).toHaveClass('smart:rounded-md');
      expect(container.firstElementChild).not.toHaveClass('smart:rounded-full');
    });

    it('should not render a dot by default', () => {
      const { container } = render(<SmartBadgePreset text="Badge" />);

      expect(container.querySelector('svg circle')).toBeNull();
    });

    it('should render a dot in the badge colour when options.withDot is true', () => {
      const { container } = render(
        <SmartBadgePreset
          text="Badge"
          color="pink"
          options={{ withDot: true }}
        />,
      );

      expect(container.querySelector('svg')).toHaveClass(
        'smart:size-1.5',
        'smart:fill-pink-500',
      );
    });

    it('should call onRemoved when the remove button is clicked', () => {
      const onRemoved = jest.fn();
      render(
        <SmartBadgePreset
          text="Badge"
          options={{ withRemove: true }}
          onRemoved={onRemoved}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

      expect(onRemoved).toHaveBeenCalledTimes(1);
    });

    it('should append className to the badge classes', () => {
      const { container } = render(
        <SmartBadgePreset text="Badge" className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:inline-flex',
        'my-extra-class',
      );
    });
  });
});
