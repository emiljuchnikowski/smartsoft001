import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { CommandPaletteUsageExample } from './usage.example';

describe('docs-examples-react: CommandPaletteUsageExample', () => {
  function setup() {
    const { container } = render(
      <SmartProvider language="eng">
        <CommandPaletteUsageExample />
      </SmartProvider>,
    );

    return {
      dialog: container.querySelector('dialog') as HTMLDialogElement,
      search: container.querySelector(
        'input[type="search"]',
      ) as HTMLInputElement,
    };
  }

  it('should render the commands and the search texts from the options', () => {
    // Act
    const { dialog, search } = setup();

    // Assert
    expect(dialog).toHaveTextContent('New project');
    expect(search).toHaveAttribute('placeholder', 'Search commands...');
    expect(search).toHaveAttribute('aria-label', 'Search commands');
  });

  it('should keep the palette closed until the trigger is clicked', () => {
    // Arrange
    const { dialog } = setup();
    expect(dialog).not.toHaveAttribute('open');

    // Act
    fireEvent.click(
      screen.getByRole('button', { name: 'Open command palette' }),
    );

    // Assert
    expect(dialog).toHaveAttribute('open');
  });

  it('should narrow the commands down to the query', () => {
    // Arrange
    const { dialog, search } = setup();

    // Act
    fireEvent.change(search, { target: { value: 'settings' } });

    // Assert
    const options = dialog.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Open settings');
  });

  it('should show the selected command and close the palette', () => {
    // Arrange
    const { dialog } = setup();
    fireEvent.click(
      screen.getByRole('button', { name: 'Open command palette' }),
    );

    // Act
    fireEvent.click(screen.getByText('New project'));

    // Assert
    expect(screen.getByText('Last command: new-project')).toBeInTheDocument();
    expect(dialog).not.toHaveAttribute('open');
  });
});
