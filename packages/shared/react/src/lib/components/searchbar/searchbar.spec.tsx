import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';

import { SmartSearchbar } from './searchbar';
import { SmartSearchbarProps } from './searchbar.types';
import { SmartSearchbarStandard } from './standard/searchbar-standard';
import { useSearchbar } from './use-searchbar';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartSearchbar', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  describe('useSearchbar', () => {
    it('should default show to true', () => {
      const { result } = renderHook(() => useSearchbar({}));

      expect(result.current.show).toBe(true);
    });

    it('should expose a form control', () => {
      const { result } = renderHook(() => useSearchbar({}));

      expect(typeof result.current.control.setValue).toBe('function');
    });

    it('should set show to true on setShow()', () => {
      const { result } = renderHook(() => useSearchbar({ defaultShow: false }));

      act(() => result.current.setShow());

      expect(result.current.show).toBe(true);
    });

    it('should hide on tryHide() while the control is empty', () => {
      const onShowChange = jest.fn();
      const { result } = renderHook(() => useSearchbar({ onShowChange }));

      act(() => result.current.tryHide());

      expect(result.current.show).toBe(false);
      expect(onShowChange).toHaveBeenCalledWith(false);
    });

    it('should stay shown on tryHide() while the control has a value', () => {
      const { result } = renderHook(() => useSearchbar({}));

      act(() => result.current.control.setValue('query'));
      act(() => result.current.tryHide());

      expect(result.current.show).toBe(true);
    });

    it('should copy a non-empty text into the control', () => {
      const { result } = renderHook(() => useSearchbar({ text: 'hello' }));

      expect(result.current.control.value).toBe('hello');
    });

    it('should not report the text it copied into the control', () => {
      const onTextChange = jest.fn();
      renderHook(() => useSearchbar({ text: 'hello', onTextChange }));

      act(() => jest.advanceTimersByTime(1000));

      expect(onTextChange).not.toHaveBeenCalled();
    });

    it('should update the text once the debounce time has passed', () => {
      const onTextChange = jest.fn();
      const { result } = renderHook(() => useSearchbar({ onTextChange }));

      act(() => result.current.control.setValue('query'));
      act(() => jest.advanceTimersByTime(1000));

      expect(onTextChange).toHaveBeenCalledWith('query');
      expect(result.current.text).toBe('query');
    });

    it('should not update the text before the debounce time has passed', () => {
      const onTextChange = jest.fn();
      const { result } = renderHook(() => useSearchbar({ onTextChange }));

      act(() => result.current.control.setValue('query'));
      act(() => jest.advanceTimersByTime(999));

      expect(onTextChange).not.toHaveBeenCalled();
    });

    it('should report only the last value of a burst', () => {
      const onTextChange = jest.fn();
      const { result } = renderHook(() => useSearchbar({ onTextChange }));

      act(() => result.current.control.setValue('q'));
      act(() => jest.advanceTimersByTime(500));
      act(() => result.current.control.setValue('qu'));
      act(() => jest.advanceTimersByTime(1000));

      expect(onTextChange.mock.calls).toEqual([['qu']]);
    });

    it('should use options.debounceTime', () => {
      const onTextChange = jest.fn();
      const { result } = renderHook(() =>
        useSearchbar({ options: { debounceTime: 300 }, onTextChange }),
      );

      act(() => result.current.control.setValue('query'));
      act(() => jest.advanceTimersByTime(300));

      expect(onTextChange).toHaveBeenCalledWith('query');
    });

    it('should drop a pending update on unmount', () => {
      const onTextChange = jest.fn();
      const { result, unmount } = renderHook(() =>
        useSearchbar({ onTextChange }),
      );

      act(() => result.current.control.setValue('query'));
      unmount();
      act(() => jest.advanceTimersByTime(1000));

      expect(onTextChange).not.toHaveBeenCalled();
    });
  });

  describe('standard', () => {
    it('should render a search input while shown', () => {
      render(<SmartSearchbarStandard />);

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should render nothing while hidden without showToggleButton', () => {
      const { container } = render(<SmartSearchbarStandard show={false} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should render nothing while hidden with showToggleButton false', () => {
      const { container } = render(
        <SmartSearchbarStandard
          show={false}
          options={{ showToggleButton: false }}
        />,
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('should render a magnifier toggle button while hidden with showToggleButton', () => {
      render(
        <SmartSearchbarStandard
          show={false}
          options={{ showToggleButton: true }}
        />,
      );

      expect(screen.getByRole('button').querySelector('svg')).toHaveAttribute(
        'data-icon',
        'magnifying-glass',
      );
      expect(screen.queryByRole('searchbox')).toBeNull();
    });

    it('should name the toggle button with the search label', () => {
      // Act
      render(
        <SmartProvider language="eng">
          <SmartSearchbarStandard
            show={false}
            options={{ showToggleButton: true }}
          />
        </SmartProvider>,
      );

      // Assert
      expect(
        screen.getByRole('button', { name: 'search' }),
      ).toBeInTheDocument();
    });

    it('should render the magnifying glass icon next to the visible input', () => {
      // Arrange
      const { container } = render(<SmartSearchbarStandard />);

      // Act
      const svg = container.querySelector('input[type="search"] + svg');

      // Assert
      expect(svg).toHaveAttribute('data-icon', 'magnifying-glass');
      expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should show the input on the toggle button click', () => {
      const onShowChange = jest.fn();
      render(
        <SmartSearchbarStandard
          defaultShow={false}
          options={{ showToggleButton: true }}
          onShowChange={onShowChange}
        />,
      );

      fireEvent.click(screen.getByRole('button'));

      expect(onShowChange).toHaveBeenCalledWith(true);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should hide an empty searchbar on blur', () => {
      const onShowChange = jest.fn();
      render(<SmartSearchbarStandard onShowChange={onShowChange} />);

      fireEvent.blur(screen.getByRole('searchbox'));

      expect(onShowChange).toHaveBeenCalledWith(false);
      expect(screen.queryByRole('searchbox')).toBeNull();
    });

    it('should stay shown on blur once something is typed', () => {
      render(<SmartSearchbarStandard />);

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'query' },
      });
      fireEvent.blur(screen.getByRole('searchbox'));

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should report typed text once the debounce time has passed', () => {
      const onTextChange = jest.fn();
      render(<SmartSearchbarStandard onTextChange={onTextChange} />);

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'query' },
      });
      act(() => jest.advanceTimersByTime(1000));

      expect(onTextChange).toHaveBeenCalledWith('query');
    });

    it('should show the text in the input', () => {
      render(<SmartSearchbarStandard text="hello" />);

      expect(screen.getByRole('searchbox')).toHaveValue('hello');
    });

    it('should apply the input classes with className appended', () => {
      render(<SmartSearchbarStandard className="my-extra-class" />);

      expect(screen.getByRole('searchbox')).toHaveClass(
        'smart:block',
        'smart:w-full',
        'smart:rounded-md',
        'smart:pr-10',
        'smart:dark:bg-white/5',
        'my-extra-class',
      );
    });

    it('should wrap the input in a relative container', () => {
      render(<SmartSearchbarStandard />);

      expect(screen.getByRole('searchbox').parentElement).toHaveClass(
        'smart:relative',
        'smart:mt-2',
      );
    });

    it('should translate options.placeholder', () => {
      render(
        <SmartSearchbarStandard options={{ placeholder: 'my-placeholder' }} />,
      );

      expect(screen.getByRole('searchbox')).toHaveAttribute(
        'placeholder',
        'my-placeholder',
      );
    });

    it('should fall back to the "search" translation', () => {
      render(
        <SmartProvider language="eng">
          <SmartSearchbarStandard />
        </SmartProvider>,
      );

      expect(screen.getByRole('searchbox')).toHaveAttribute(
        'placeholder',
        'search',
      );
    });
  });

  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      render(<SmartSearchbar text="" />);

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should render the implementation registered as components.searchbar', () => {
      const Custom = ({ text }: SmartSearchbarProps) => (
        <span data-testid="custom">{text}</span>
      );

      render(
        <SmartProvider components={{ searchbar: Custom }}>
          <SmartSearchbar text="query" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('query');
    });

    it('should pass onShowChange through', () => {
      const onShowChange = jest.fn();
      render(<SmartSearchbar text="" onShowChange={onShowChange} />);

      fireEvent.blur(screen.getByRole('searchbox'));

      expect(onShowChange).toHaveBeenCalledWith(false);
    });
  });
});
