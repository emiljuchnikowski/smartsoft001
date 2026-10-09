import { fireEvent, render, screen } from '@testing-library/react';

import { PagingCustomExample } from './custom.example';

describe('docs-examples-react: PagingCustomExample', () => {
  it('should render the custom paging instead of the standard one', () => {
    const { container } = render(<PagingCustomExample />);

    expect(container.querySelector('nav.docs-paging')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveClass(
      'docs-paging__next',
    );
  });

  it('should render the range summary computed by the hook', () => {
    render(<PagingCustomExample />);

    expect(
      screen.getByText('Showing 1 to 10 of 48 results'),
    ).toBeInTheDocument();
  });

  it('should disable the previous button on the first page', () => {
    render(<PagingCustomExample />);

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('should report the next page back to the example', () => {
    render(<PagingCustomExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent(
      '2',
    );
    expect(
      screen.getByText('Showing 11 to 20 of 48 results'),
    ).toBeInTheDocument();
  });
});
