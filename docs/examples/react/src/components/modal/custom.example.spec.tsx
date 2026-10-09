import { fireEvent, render, screen } from '@testing-library/react';

import { CustomModal, ModalCustomExample } from './custom.example';

describe('docs-examples-react: ModalCustomExample', () => {
  it('should render the custom modal instead of the standard one', () => {
    const { container } = render(<ModalCustomExample />);

    expect(screen.getByRole('dialog')).toHaveClass(
      'docs-modal',
      'docs-modal--centered',
    );
    expect(container.querySelector('dialog')).toBeNull();
  });

  it('should render the title and description', () => {
    const { container } = render(<ModalCustomExample />);

    expect(container.querySelector('.docs-modal__title')).toHaveTextContent(
      'Deactivate account',
    );
    expect(
      container.querySelector('.docs-modal__description'),
    ).toHaveTextContent('permanently removed');
  });

  it('should render one footer button per action', () => {
    const { container } = render(<ModalCustomExample />);

    const actions = container.querySelectorAll('.docs-modal__action');

    expect(actions).toHaveLength(2);
    expect(actions[1]).toHaveAttribute('data-variant', 'danger');
    expect(container.querySelector('.docs-modal__footer')).toHaveClass(
      'docs-modal__footer--gray',
    );
  });

  it('should report the action id through onActionClick', () => {
    const onActionClick = jest.fn();
    render(
      <CustomModal
        open
        actions={[{ id: 'deactivate', label: 'Deactivate' }]}
        onActionClick={onActionClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Deactivate' }));

    expect(onActionClick).toHaveBeenCalledWith({ actionId: 'deactivate' });
  });

  it('should hide the dialog when the custom dismiss button is clicked', () => {
    render(<ModalCustomExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should close and report onClosed when the backdrop is clicked', () => {
    const onClosed = jest.fn();
    const { container } = render(
      <CustomModal
        defaultOpen
        title="Deactivate account"
        onClosed={onClosed}
      />,
    );

    fireEvent.click(
      container.querySelector('.docs-modal__backdrop') as HTMLElement,
    );

    expect(onClosed).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
