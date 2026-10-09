import { fireEvent, render, screen } from '@testing-library/react';

import { SelectMenuCustomExample } from './custom.example';

describe('docs-examples-react: SelectMenuCustomExample', () => {
  function open() {
    fireEvent.click(screen.getByRole('button', { name: 'Country' }));
  }

  it('should render the custom select menu instead of the standard one', () => {
    const { container } = render(<SelectMenuCustomExample />);

    expect(container.querySelector('.docs-select-menu')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('should show the placeholder until something is selected', () => {
    render(<SelectMenuCustomExample />);

    expect(screen.getByRole('button', { name: 'Country' })).toHaveTextContent(
      'Choose a country',
    );
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should list every item from the options once opened', () => {
    render(<SelectMenuCustomExample />);

    open();

    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('should select an item through the hook and close the list', () => {
    render(<SelectMenuCustomExample />);

    open();
    fireEvent.click(screen.getByRole('option', { name: 'Germany' }));

    expect(screen.getByRole('button', { name: 'Country' })).toHaveTextContent(
      'Germany',
    );
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
