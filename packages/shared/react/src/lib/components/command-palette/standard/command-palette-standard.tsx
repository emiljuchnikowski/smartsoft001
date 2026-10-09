import { SmartCommandPaletteProps } from '../command-palette.types';
import { useCommandPalette } from '../use-command-palette';

/**
 * The default command palette: a native `<dialog>` with a search input and a
 * `listbox` of the filtered commands. Clicking an option runs it and closes the
 * palette; the dialog's `close` event (e.g. Escape on a modal dialog) closes it
 * too.
 */
export function SmartCommandPaletteStandard(props: SmartCommandPaletteProps) {
  const { options, className = '' } = props;
  const { open, query, setQuery, filteredCommands, selectCommand, close } =
    useCommandPalette(props);

  return (
    <dialog open={open} className={className || undefined} onClose={close}>
      <input
        type="search"
        value={query}
        placeholder={options?.placeholder}
        aria-label={options?.ariaLabel}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ul role="listbox">
        {filteredCommands.length > 0 ? (
          filteredCommands.map((command) => (
            <li
              key={command.id}
              role="option"
              onClick={() => selectCommand(command.id)}
            >
              {command.label}
            </li>
          ))
        ) : (
          <li className="smart-command-palette-empty">
            {options?.emptyText ?? 'No results'}
          </li>
        )}
      </ul>
    </dialog>
  );
}
