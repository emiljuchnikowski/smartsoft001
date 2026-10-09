// #region usage
import {
  ICommand,
  ICommandPaletteOptions,
  SmartCommandPalette,
  SmartCommandPaletteProps,
  SmartProvider,
  useCommandPalette,
} from '@smartsoft001/react';

/**
 * A custom command palette built on `useCommandPalette`.
 *
 * The hook owns the `open` and `query` state (controlled or not), the
 * `filteredCommands` and `selectCommand()` / `close()`. It binds no keyboard
 * listeners: handling Escape or a global Cmd+K is the implementation's job.
 * Call `selectCommand()` rather than `onRunCommand` by hand, because it also
 * closes the palette.
 */
export function CustomCommandPalette(props: SmartCommandPaletteProps) {
  const { options, className } = props;
  const { open, query, setQuery, filteredCommands, selectCommand } =
    useCommandPalette(props);

  return (
    <div
      className={['docs-command-palette', className].filter(Boolean).join(' ')}
      hidden={!open}
    >
      <input
        type="search"
        className="docs-command-palette__search"
        value={query}
        placeholder={options?.placeholder}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ul role="listbox" className="docs-command-palette__list">
        {filteredCommands.map((command) => (
          <li key={command.id} role="option" aria-selected={false}>
            <button type="button" onClick={() => selectCommand(command.id)}>
              {command.label}
            </button>
          </li>
        ))}
        {filteredCommands.length === 0 && (
          <li className="docs-command-palette__empty">
            {options?.emptyText ?? 'No results'}
          </li>
        )}
      </ul>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'command-palette': CustomCommandPalette };

const commands: ICommand[] = [
  { id: 'new-file', label: 'New file', group: 'Files' },
  { id: 'open-settings', label: 'Open settings', group: 'Files' },
  { id: 'toggle-theme', label: 'Toggle theme', group: 'View' },
];

const options: ICommandPaletteOptions = {
  placeholder: 'Search commands…',
  emptyText: 'No results',
};

// Every <SmartCommandPalette> below the provider renders CustomCommandPalette.
export function CommandPaletteCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartCommandPalette commands={commands} options={options} defaultOpen />
    </SmartProvider>
  );
}
// #endregion
