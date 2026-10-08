import { render, screen } from '@testing-library/react';

import { SmartLoader } from './loader';
import { SmartLoaderProps } from './loader.types';
import { SmartLoaderPreset } from './preset/loader-preset';
import { getLoaderSpinnerClasses } from './preset/preset-classes';
import { SmartLoaderStandard } from './standard/loader-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartLoader', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartLoader show={true} />);

      expect(container.querySelector('svg')).toHaveAttribute('role', 'status');
    });

    it('should render the implementation registered as components.loader', () => {
      const Custom = ({ show }: SmartLoaderProps) => (
        <span data-testid="custom">{show ? 'on' : 'off'}</span>
      );

      render(
        <SmartProvider components={{ loader: Custom }}>
          <SmartLoader show={true} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('on');
    });

    it('should pass size, color and className to the implementation', () => {
      const { container } = render(
        <SmartLoader
          show={true}
          size="xl"
          color="red"
          className="passed-class"
        />,
      );

      expect(container.querySelector('svg')).toHaveClass(
        'smart:size-10',
        'smart:text-red-600',
        'passed-class',
      );
    });
  });

  describe('standard', () => {
    it('should not render the spinner by default', () => {
      const { container } = render(<SmartLoaderStandard />);

      expect(container.querySelector('svg')).toBeNull();
    });

    it('should render the spinner when show is true', () => {
      render(<SmartLoaderStandard show={true} />);

      expect(
        screen.getByRole('status', { name: 'loading' }),
      ).toBeInTheDocument();
    });

    it('should hide the spinner again when show goes back to false', () => {
      const { container, rerender } = render(
        <SmartLoaderStandard show={true} />,
      );

      rerender(<SmartLoaderStandard show={false} />);

      expect(container.querySelector('svg')).toBeNull();
    });

    it('should default to the md size and the indigo color', () => {
      render(<SmartLoaderStandard show={true} />);

      expect(screen.getByRole('status')).toHaveClass(
        'smart:animate-spin',
        'smart:size-6',
        'smart:text-indigo-600',
      );
    });

    it.each([
      ['xs', 'smart:size-4'],
      ['sm', 'smart:size-5'],
      ['md', 'smart:size-6'],
      ['lg', 'smart:size-8'],
      ['xl', 'smart:size-10'],
    ] as const)('should map size %s to %s', (size, expected) => {
      render(<SmartLoaderStandard show={true} size={size} />);

      expect(screen.getByRole('status')).toHaveClass(expected);
    });

    it.each([
      ['red', 'smart:text-red-600'],
      ['emerald', 'smart:text-emerald-600'],
    ] as const)('should map color %s to %s', (color, expected) => {
      render(<SmartLoaderStandard show={true} color={color} />);

      expect(screen.getByRole('status')).toHaveClass(expected);
    });

    it('should append className to the spinner classes', () => {
      render(<SmartLoaderStandard show={true} className="my-loader" />);

      expect(screen.getByRole('status')).toHaveClass('my-loader');
    });
  });

  describe('preset', () => {
    it('should not render anything when show is false', () => {
      const { container } = render(<SmartLoaderPreset show={false} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should render the spinner with an accessible label', () => {
      render(<SmartLoaderPreset show={true} />);

      expect(screen.getByRole('status', { name: 'loading' })).toHaveTextContent(
        'Loading...',
      );
    });

    it('should hide the "Loading..." text visually', () => {
      render(<SmartLoaderPreset show={true} />);

      expect(screen.getByText('Loading...')).toHaveClass('smart:sr-only');
    });

    it('should apply the bordered-ring spinner classes', () => {
      render(<SmartLoaderPreset show={true} />);

      expect(screen.getByRole('status')).toHaveClass(
        'smart:animate-spin',
        'smart:border-current',
        'smart:border-t-transparent',
        'smart:rounded-full',
      );
    });

    it('should default to the md size and the indigo color', () => {
      render(<SmartLoaderPreset show={true} />);

      expect(screen.getByRole('status')).toHaveClass(
        'smart:size-6',
        'smart:text-indigo-600',
      );
    });

    it('should apply the size classes', () => {
      render(<SmartLoaderPreset show={true} size="xl" />);

      expect(screen.getByRole('status')).toHaveClass('smart:size-10');
    });

    it('should apply the color classes with a dark variant', () => {
      render(<SmartLoaderPreset show={true} color="rose" />);

      expect(screen.getByRole('status')).toHaveClass(
        'smart:text-rose-600',
        'smart:dark:text-rose-500',
      );
    });

    it('should apply className on the spinner', () => {
      render(<SmartLoaderPreset show={true} className="my-extra-class" />);

      expect(screen.getByRole('status')).toHaveClass('my-extra-class');
    });
  });

  describe('getLoaderSpinnerClasses', () => {
    it('should combine the ring, size and color recipes', () => {
      const result = getLoaderSpinnerClasses('sm', 'blue');

      expect(result).toBe(
        'smart:animate-spin smart:inline-block smart:border-3 smart:border-current smart:border-t-transparent smart:rounded-full smart:size-5 smart:text-blue-600 smart:dark:text-blue-500',
      );
    });
  });
});
