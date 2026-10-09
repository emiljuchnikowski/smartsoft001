// #region usage
import { useState } from 'react';

import {
  ICommand,
  ICommandPaletteOptions,
  SmartCommandPalette,
} from '@smartsoft001/react';

const commands: ICommand[] = [
  { id: 'new-project', label: 'New project', group: 'Projects' },
  { id: 'invite-member', label: 'Invite team member', group: 'Team' },
  { id: 'open-settings', label: 'Open settings', group: 'Account' },
];

const options: ICommandPaletteOptions = {
  variant: 'simple',
  placeholder: 'Search commands...',
  emptyText: 'No commands found.',
  ariaLabel: 'Command palette',
};

export function CommandPaletteUsageExample() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open command palette
      </button>

      <SmartCommandPalette
        commands={commands}
        options={options}
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        onRunCommand={({ commandId }) => setLastCommand(commandId)}
      />

      {lastCommand && <p>Last command: {lastCommand}</p>}
    </>
  );
}
// #endregion
