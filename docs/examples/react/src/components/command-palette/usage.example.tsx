// #region usage
import { useState } from 'react';

import {
  ICommand,
  ICommandPaletteOptions,
  SmartButton,
  SmartCommandPalette,
} from '@smartsoft001/react';

const commands: ICommand[] = [
  { id: 'new-project', label: 'New project' },
  { id: 'invite-member', label: 'Invite team member' },
  { id: 'open-settings', label: 'Open settings' },
];

const options: ICommandPaletteOptions = {
  placeholder: 'Search commands...',
  emptyText: 'No commands found.',
  ariaLabel: 'Search commands',
};

export function CommandPaletteUsageExample() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  return (
    <>
      <SmartButton options={{ click: () => setOpen(true) }}>
        Open command palette
      </SmartButton>

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
