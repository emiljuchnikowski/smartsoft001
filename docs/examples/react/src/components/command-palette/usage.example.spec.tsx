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

  it('should render the commands and placeholder from the props', () => {
    const { dialog, search } = setup();

    expect(dialog).toHaveTextContent('New project');
    expect(search).toHaveAttribute('placeholder', 'Search commands...');
  });

  it('should keep the palette closed until the trigger is clicked', () => {
    const { dialog } = setup();
    expect(dialog).not.toHaveAttribute('open');

    fireEvent.click(screen.getByText('Open command palette'));

    expect(dialog).toHaveAttribute('open');
  });

  it('should narrow the commands down to the query', () => {
    const { dialog, search } = setup();

    fireEvent.change(search, { target: { value: 'settings' } });

    const options = dialog.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Open settings');
  });

  it('should hand the selected command id to the handler and close', () => {
    const { dialog } = setup();
    fireEvent.click(screen.getByText('Open command palette'));

    fireEvent.click(screen.getByText('New project'));

    expect(screen.getByText('Last command: new-project')).toBeInTheDocument();
    expect(dialog).not.toHaveAttribute('open');
  });
});
