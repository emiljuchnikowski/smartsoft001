import { Fragment, useState } from 'react';
import type { ReactNode } from 'react';

import { ICommand, SmartCommandPaletteVariant } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartCommandPaletteProps } from '../command-palette.types';
import { useCommandPalette } from '../use-command-palette';
import {
  COMMAND_PALETTE_EMPTY,
  COMMAND_PALETTE_FOOTER,
  COMMAND_PALETTE_GROUP,
  COMMAND_PALETTE_ITEM_ICON,
  COMMAND_PALETTE_ITEM_IMAGE,
  COMMAND_PALETTE_ITEM_LABEL,
  COMMAND_PALETTE_PREVIEW,
  COMMAND_PALETTE_PREVIEW_LAYOUT,
  COMMAND_PALETTE_SEARCH,
  COMMAND_PALETTE_SEARCH_ICON,
  COMMAND_PALETTE_SEARCH_WRAP,
  getCommandPaletteDialogClasses,
  getCommandPaletteItemClasses,
  getCommandPaletteListClasses,
} from './preset-classes';

interface ICommandGroup {
  group: string;
  commands: ICommand[];
}

function groupCommands(commands: ICommand[]): ICommandGroup[] {
  const groups: ICommandGroup[] = [];
  for (const command of commands) {
    const key = command.group ?? 'Other';
    const existing = groups.find((g) => g.group === key);
    if (existing) {
      existing.commands.push(command);
    } else {
      groups.push({ group: key, commands: [command] });
    }
  }
  return groups;
}

/**
 * Styled command-palette variation (preset). Register it as
 * `components['command-palette']` on `SmartProvider` to restyle every
 * `<SmartCommandPalette>`, or render it directly.
 *
 * All filtering/selection logic comes from `useCommandPalette`; this
 * component only adds the visual variants driven by `options.variant`
 * (`simple` by default): looser rows, icons, images, a translucent dialog,
 * group headers, a footer, or a preview pane showing the first result (or the
 * hovered one).
 */
export function SmartCommandPalettePreset(props: SmartCommandPaletteProps) {
  const { options, className = '' } = props;
  const { open, query, setQuery, filteredCommands, selectCommand, close } =
    useCommandPalette(props);
  const [previewOverride, setPreviewOverride] = useState<ICommand | null>(null);

  const variant: SmartCommandPaletteVariant = options?.variant ?? 'simple';
  const emptyText = options?.emptyText ?? 'No results';
  const itemClasses = getCommandPaletteItemClasses(variant);
  const listClasses = getCommandPaletteListClasses(variant);
  // Defaults to the first result; hovering a row overrides it.
  const previewCommand = previewOverride ?? filteredCommands[0] ?? null;

  const row = (command: ICommand) => (
    <>
      {variant === 'with-images' && command.imageUrl ? (
        <img
          data-role="item-image"
          className={COMMAND_PALETTE_ITEM_IMAGE}
          src={command.imageUrl}
          alt={command.label}
        />
      ) : (
        variant === 'with-icons' && (
          <span data-role="item-icon" className={COMMAND_PALETTE_ITEM_ICON}>
            {command.icon ?? '#'}
          </span>
        )
      )}
      <span className={COMMAND_PALETTE_ITEM_LABEL}>{command.label}</span>
    </>
  );

  const item = (command: ICommand, onMouseEnter?: () => void) => (
    <li
      key={command.id}
      data-role="item"
      role="option"
      className={itemClasses}
      onMouseEnter={onMouseEnter}
      onClick={() => selectCommand(command.id)}
    >
      {row(command)}
    </li>
  );

  const empty = (
    <li data-role="empty" className={COMMAND_PALETTE_EMPTY}>
      {emptyText}
    </li>
  );

  let list: ReactNode;
  if (variant === 'with-preview') {
    list = (
      <div
        data-role="preview-layout"
        className={COMMAND_PALETTE_PREVIEW_LAYOUT}
      >
        <ul data-role="list" role="listbox" className={listClasses}>
          {filteredCommands.length > 0
            ? filteredCommands.map((command) =>
                item(command, () => setPreviewOverride(command)),
              )
            : empty}
        </ul>
        <div data-role="preview" className={COMMAND_PALETTE_PREVIEW}>
          {previewCommand && (
            <>
              <p className="smart:font-medium smart:text-gray-900 smart:dark:text-white">
                {previewCommand.label}
              </p>
              {previewCommand.description && (
                <p className="smart:mt-1">{previewCommand.description}</p>
              )}
            </>
          )}
        </div>
      </div>
    );
  } else if (variant === 'with-groups') {
    const groups = groupCommands(filteredCommands);
    list = (
      <ul data-role="list" role="listbox" className={listClasses}>
        {groups.length > 0
          ? groups.map((grp) => (
              <Fragment key={grp.group}>
                <li data-role="group" className={COMMAND_PALETTE_GROUP}>
                  {grp.group}
                </li>
                {grp.commands.map((command) => item(command))}
              </Fragment>
            ))
          : empty}
      </ul>
    );
  } else {
    list = (
      <ul data-role="list" role="listbox" className={listClasses}>
        {filteredCommands.length > 0
          ? filteredCommands.map((command) => item(command))
          : empty}
      </ul>
    );
  }

  return (
    <dialog
      data-role="dialog"
      open={open}
      className={cn(getCommandPaletteDialogClasses(variant), className)}
      onClose={close}
    >
      <div data-role="search-wrap" className={COMMAND_PALETTE_SEARCH_WRAP}>
        <svg
          className={COMMAND_PALETTE_SEARCH_ICON}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          data-role="search"
          type="search"
          className={COMMAND_PALETTE_SEARCH}
          value={query}
          placeholder={options?.placeholder}
          aria-label={options?.ariaLabel}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {list}

      {variant === 'with-footer' && (
        <div data-role="footer" className={COMMAND_PALETTE_FOOTER}>
          <span>{`${filteredCommands.length} results`}</span>
          <span>Enter to run &middot; Esc to close</span>
        </div>
      )}
    </dialog>
  );
}
