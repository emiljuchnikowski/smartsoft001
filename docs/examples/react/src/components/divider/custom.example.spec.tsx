import { fireEvent, render, screen } from '@testing-library/react';

import { SmartDivider, SmartProvider } from '@smartsoft001/react';

import { CustomDivider, DividerCustomExample } from './custom.example';

describe('docs-examples-react: DividerCustomExample', () => {
  it('should render the custom divider instead of the standard one', () => {
    const { container } = render(<DividerCustomExample />);

    expect(container.querySelector('.docs-divider')).not.toBeNull();
    expect(container.querySelector('.smart-divider-title')).toBeNull();
  });

  it('should render the title and the action label', () => {
    render(<DividerCustomExample />);

    expect(screen.getByRole('separator')).toHaveTextContent('Team members');
    expect(screen.getByRole('button')).toHaveTextContent('Add member');
  });

  it('should receive onActionClick from SmartDivider and call it on click', () => {
    const onActionClick = jest.fn();
    render(
      <SmartProvider components={{ divider: CustomDivider }}>
        <SmartDivider actionLabel="Add member" onActionClick={onActionClick} />
      </SmartProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add member' }));

    expect(onActionClick).toHaveBeenCalledTimes(1);
  });
});
