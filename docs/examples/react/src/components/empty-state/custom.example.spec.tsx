import { fireEvent, render, screen } from '@testing-library/react';

import { SmartEmptyState, SmartProvider } from '@smartsoft001/react';

import { CustomEmptyState, EmptyStateCustomExample } from './custom.example';

describe('docs-examples-react: EmptyStateCustomExample', () => {
  it('should render the custom empty state instead of the standard one', () => {
    const { container } = render(<EmptyStateCustomExample />);

    expect(container.querySelector('.docs-empty-state')).not.toBeNull();
    expect(container.querySelector('.empty-state')).toBeNull();
    expect(
      container.querySelector('.docs-empty-state__title'),
    ).toHaveTextContent('No draft invoices');
    expect(
      container.querySelector('.docs-empty-state__description'),
    ).toHaveTextContent('Draft an invoice and send it to a customer.');
  });

  it('should render one button per action from the options', () => {
    const { container } = render(<EmptyStateCustomExample />);

    const actions = container.querySelectorAll('.docs-empty-state__action');

    expect(actions).toHaveLength(2);
    expect(actions[0]).toHaveTextContent('Create a new invoice');
    expect(actions[1]).toHaveAttribute('data-variant', 'secondary');
  });

  it('should report the clicked action id through onActionClick', () => {
    const onActionClick = jest.fn();
    render(
      <SmartProvider components={{ 'empty-state': CustomEmptyState }}>
        <SmartEmptyState
          options={{ actions: [{ id: 'create', label: 'Create' }] }}
          onActionClick={onActionClick}
        />
      </SmartProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(onActionClick).toHaveBeenCalledWith({ actionId: 'create' });
  });
});
