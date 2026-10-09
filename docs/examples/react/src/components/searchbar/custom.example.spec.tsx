import { act, fireEvent, render, screen } from '@testing-library/react';

import { SearchbarCustomExample } from './custom.example';

describe('docs-examples-react: SearchbarCustomExample', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('should render the custom searchbar instead of the standard one', () => {
    const { container } = render(<SearchbarCustomExample />);

    expect(container.querySelector('.docs-searchbar')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveClass('docs-searchbar__input');
  });

  it('should render the input with the placeholder and label from the options', () => {
    render(<SearchbarCustomExample />);

    const input = screen.getByLabelText('Search invoices');

    expect(input).toHaveAttribute('placeholder', 'Search invoices');
    expect(input).toHaveValue('');
  });

  it('should report the typed text once the debounce of the hook settles', () => {
    render(<SearchbarCustomExample />);

    fireEvent.change(screen.getByLabelText('Search invoices'), {
      target: { value: 'invoice' },
    });
    act(() => jest.advanceTimersByTime(300));

    expect(screen.getByText('Results for "invoice"')).toBeInTheDocument();
  });

  it('should hide the empty input on blur and bring it back through the toggle button', () => {
    render(<SearchbarCustomExample />);

    fireEvent.blur(screen.getByLabelText('Search invoices'));

    expect(screen.queryByLabelText('Search invoices')).toBeNull();
    fireEvent.click(
      screen.getByRole('button', { name: 'Show the search field' }),
    );
    expect(screen.getByLabelText('Search invoices')).toBeInTheDocument();
  });
});
