import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { PagingUsageExample } from './usage.example';

describe('docs-examples-react: PagingUsageExample', () => {
  function setup() {
    // The standard paging labels its buttons through the provider's translations.
    render(
      <SmartProvider language="eng">
        <PagingUsageExample />
      </SmartProvider>,
    );
  }

  it('should mark the current page from the props', () => {
    setup();

    expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent(
      '1',
    );
  });

  it('should list the pages computed from the total items', () => {
    setup();

    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('should move to the selected page', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: '2' }));

    expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent(
      '2',
    );
  });

  it('should move to the next page from the translated next button', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'next' }));

    expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent(
      '2',
    );
  });
});
