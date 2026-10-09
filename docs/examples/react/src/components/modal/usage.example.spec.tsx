import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { ModalUsageExample } from './usage.example';

describe('docs-examples-react: ModalUsageExample', () => {
  function setup() {
    const { container } = render(
      <SmartProvider language="eng">
        <ModalUsageExample />
      </SmartProvider>,
    );

    return () => container.querySelector('dialog') as HTMLDialogElement;
  }

  function openModal() {
    fireEvent.click(screen.getByRole('button', { name: 'Deactivate account' }));
  }

  it('should keep the modal closed until the trigger is clicked', () => {
    const dialog = setup();

    expect(dialog()).not.toHaveAttribute('open');
  });

  it('should open the modal when the trigger is clicked', () => {
    const dialog = setup();

    openModal();

    expect(dialog()).toHaveAttribute('open');
    expect(dialog()).toHaveTextContent('Deactivate account');
    expect(dialog()).toHaveTextContent('permanently removed');
  });

  it('should hand the clicked action id to the handler and close the modal', () => {
    const dialog = setup();
    openModal();

    fireEvent.click(screen.getByRole('button', { name: 'Deactivate' }));

    expect(screen.getByText('Last action: deactivate')).toBeInTheDocument();
    expect(screen.getByText('Closed by the user: 0')).toBeInTheDocument();
    expect(dialog()).not.toHaveAttribute('open');
  });

  it('should run the closed handler and close the modal on dismiss', () => {
    const dialog = setup();
    openModal();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(dialog()).not.toHaveAttribute('open');
    expect(screen.getByText('Closed by the user: 1')).toBeInTheDocument();
  });
});
