import { render, screen } from '@testing-library/react';

import { SmartPasswordStrength } from './password-strength';
import { SmartPasswordStrengthProps } from './password-strength.types';
import { SmartPasswordStrengthStandard } from './standard/password-strength-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartPasswordStrength', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartPasswordStrength passwordToCheck="abc" showHint={false} />,
      );

      expect(container.querySelector('ul > li')).toHaveClass(
        'smart:bg-red-600',
      );
    });

    it('should render the implementation registered as components["password-strength"]', () => {
      const Custom = ({ passwordToCheck }: SmartPasswordStrengthProps) => (
        <span data-testid="custom">{passwordToCheck}</span>
      );

      render(
        <SmartProvider components={{ 'password-strength': Custom }}>
          <SmartPasswordStrength passwordToCheck="secret" showHint={false} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('secret');
    });

    it('should report a strong password through onPasswordStrength', () => {
      const onPasswordStrength = jest.fn();

      render(
        <SmartPasswordStrength
          passwordToCheck="Abcdefg1!"
          showHint={false}
          onPasswordStrength={onPasswordStrength}
        />,
      );

      expect(onPasswordStrength).toHaveBeenLastCalledWith(true);
    });
  });

  describe('onPasswordStrength', () => {
    it('should report false for a password that is not strong', () => {
      const onPasswordStrength = jest.fn();

      render(
        <SmartPasswordStrengthStandard
          passwordToCheck="abc"
          showHint={false}
          onPasswordStrength={onPasswordStrength}
        />,
      );

      expect(onPasswordStrength).toHaveBeenCalledWith(false);
    });

    it('should report again when the strength changes', () => {
      const onPasswordStrength = jest.fn();
      const { rerender } = render(
        <SmartPasswordStrengthStandard
          passwordToCheck="abc"
          showHint={false}
          onPasswordStrength={onPasswordStrength}
        />,
      );

      rerender(
        <SmartPasswordStrengthStandard
          passwordToCheck="Abcdefg1!"
          showHint={false}
          onPasswordStrength={onPasswordStrength}
        />,
      );

      expect(onPasswordStrength.mock.calls).toEqual([[false], [true]]);
    });

    it('should not report again while the strength stays the same', () => {
      const onPasswordStrength = jest.fn();
      const { rerender } = render(
        <SmartPasswordStrengthStandard
          passwordToCheck="Abcdefg1!"
          showHint={false}
          onPasswordStrength={onPasswordStrength}
        />,
      );

      rerender(
        <SmartPasswordStrengthStandard
          passwordToCheck="Abcdefg1!"
          showHint
          onPasswordStrength={onPasswordStrength}
        />,
      );

      expect(onPasswordStrength).toHaveBeenCalledTimes(1);
    });
  });

  describe('standard', () => {
    it('should render three bars', () => {
      const { container } = render(
        <SmartPasswordStrengthStandard passwordToCheck="" showHint={false} />,
      );

      const bars = container.querySelectorAll('ul > li');

      expect(bars).toHaveLength(3);
    });

    it.each([
      [
        'empty',
        '',
        ['smart:bg-gray-300', 'smart:bg-gray-300', 'smart:bg-gray-300'],
      ],
      [
        'weak',
        'abc',
        ['smart:bg-red-600', 'smart:bg-gray-300', 'smart:bg-gray-300'],
      ],
      [
        'medium',
        'Abcdefgh',
        ['smart:bg-orange-500', 'smart:bg-orange-500', 'smart:bg-gray-300'],
      ],
      [
        'strong',
        'Abcdefg1!',
        ['smart:bg-yellow-500', 'smart:bg-yellow-500', 'smart:bg-yellow-500'],
      ],
    ])('should colour the bars of a %s password', (_name, password, colors) => {
      const { container } = render(
        <SmartPasswordStrengthStandard
          passwordToCheck={password}
          showHint={false}
        />,
      );

      const bars = container.querySelectorAll('ul > li');

      expect(bars[0]).toHaveClass(colors[0], 'smart:h-1');
      expect(bars[1]).toHaveClass(colors[1], 'smart:h-1');
      expect(bars[2]).toHaveClass(colors[2], 'smart:h-1');
    });

    it('should not render the message for an empty password', () => {
      const { container } = render(
        <SmartPasswordStrengthStandard passwordToCheck="" showHint={false} />,
      );

      expect(container.querySelector('p')).toBeNull();
    });

    it.each([
      ['abc', 'bardzo słabe'],
      ['Abcdefgh', 'słabe'],
      ['Abcdefg1!', 'dobre'],
    ])('should render the translated message for %s', (password, text) => {
      const { container } = render(
        <SmartPasswordStrengthStandard
          passwordToCheck={password}
          showHint={false}
        />,
      );

      expect(container.querySelector('p')).toHaveTextContent(text);
    });

    it('should colour the message of a weak password', () => {
      const { container } = render(
        <SmartPasswordStrengthStandard
          passwordToCheck="abc"
          showHint={false}
        />,
      );

      expect(container.querySelector('p')).toHaveClass(
        'smart:font-bold',
        'smart:text-red-600',
      );
    });

    it('should not render the hint list when showHint is false', () => {
      const { container } = render(
        <SmartPasswordStrengthStandard passwordToCheck="" showHint={false} />,
      );

      expect(container.querySelectorAll('ul')).toHaveLength(1);
    });

    it('should list every rule for an empty password', () => {
      render(
        <SmartProvider language="eng">
          <SmartPasswordStrengthStandard passwordToCheck="" showHint />
        </SmartProvider>,
      );

      const hints = screen.getAllByRole('list')[1].querySelectorAll('li');

      expect(Array.from(hints, (li) => li.textContent)).toEqual([
        'min length 7',
        'upper letters',
        'lower letters',
        'special characters',
      ]);
    });

    it.each([
      ['abcdefg', 'min length'],
      ['A', 'upper letters'],
      ['a', 'lower letters'],
      ['!', 'special characters'],
    ])('should hide the met rule for %s', (password, hint) => {
      render(
        <SmartProvider language="eng">
          <SmartPasswordStrengthStandard passwordToCheck={password} showHint />
        </SmartProvider>,
      );

      expect(screen.getAllByRole('list')[1]).not.toHaveTextContent(hint);
    });

    it('should colour the hint list like the message', () => {
      render(<SmartPasswordStrengthStandard passwordToCheck="abc" showHint />);

      expect(screen.getAllByRole('list')[1]).toHaveClass('smart:text-red-600');
    });

    it('should append className to the container classes', () => {
      const { container } = render(
        <SmartPasswordStrengthStandard
          passwordToCheck=""
          showHint={false}
          className="my-strength"
        />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:w-1/3',
        'smart:max-sm:w-full',
        'my-strength',
      );
    });
  });
});
