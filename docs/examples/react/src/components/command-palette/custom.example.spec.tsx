import { fireEvent, render, screen } from '@testing-library/react';

import { CommandPaletteCustomExample } from './custom.example';

describe('docs-examples-react: CommandPaletteCustomExample', () => {
  it('should render the custom palette instead of the standard one', () => {
    const { container } = render(<CommandPaletteCustomExample />);

    expect(container.querySelector('.docs-command-palette')).not.toBeNull();
    expect(container.querySelector('dialog')).toBeNull();
  });

  it('should list every command while the query is empty', () => {
    render(<CommandPaletteCustomExample />);

    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('should narrow the list down to the commands matching the query', () => {
    render(<CommandPaletteCustomExample />);

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'theme' },
    });

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Toggle theme');
  });

  it('should close the palette when a command is selected', () => {
    const { container } = render(<CommandPaletteCustomExample />);

    fireEvent.click(screen.getByRole('button', { name: 'New file' }));

    expect(container.querySelector('.docs-command-palette')).toHaveAttribute(
      'hidden',
    );
  });
});
