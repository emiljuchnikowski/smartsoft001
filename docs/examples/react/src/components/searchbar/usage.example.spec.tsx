import { act, fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { SearchbarUsageExample } from './usage.example';

describe('docs-examples-react: SearchbarUsageExample', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  function setup() {
    // The standard searchbar passes its placeholder through the translations.
    render(
      <SmartProvider language="eng">
        <SearchbarUsageExample />
      </SmartProvider>,
    );

    return screen.getByPlaceholderText('Search orders');
  }

  it('should render the input with the placeholder from the options', () => {
    const input = setup();

    expect(input).toHaveAttribute('type', 'search');
  });

  it('should write the typed text into the state after the debounce', () => {
    const input = setup();

    fireEvent.change(input, { target: { value: 'invoice' } });
    act(() => jest.advanceTimersByTime(300));

    expect(screen.getByText('Results for "invoice"')).toBeInTheDocument();
  });

  it('should not report the text before the debounce settles', () => {
    const input = setup();

    fireEvent.change(input, { target: { value: 'invoice' } });
    act(() => jest.advanceTimersByTime(299));

    expect(screen.queryByText(/Results for/)).not.toBeInTheDocument();
  });

  it('should collapse to the toggle button on blur while empty', () => {
    const input = setup();

    fireEvent.blur(input);

    expect(screen.queryByPlaceholderText('Search orders')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByPlaceholderText('Search orders')).toBeInTheDocument();
  });
});
