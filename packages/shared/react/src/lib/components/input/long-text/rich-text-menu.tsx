import { Fragment, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { SmartRichTextCommand, SmartRichTextState } from './rich-text-commands';
import {
  keepEditorFocus,
  SmartRichTextColorPopup,
  SmartRichTextImagePopup,
  SmartRichTextLinkPopup,
} from './rich-text-popups';
import {
  RICH_TEXT_ICONS,
  RICH_TEXT_LABELS,
  SmartRichTextHeading,
  SmartRichTextIconName,
  SmartRichTextToolbar,
  SmartRichTextToolbarItem,
} from './rich-text-toolbar';
import { cn } from '../../../utils/class-names';

const MENU_BAR_CLASSES =
  'smart:flex smart:flex-wrap smart:gap-x-0.5 smart:gap-y-1 smart:p-1 smart:border-b smart:border-gray-300 smart:dark:border-white/10';

const ITEM_CLASSES =
  'smart:relative smart:flex smart:shrink-0 smart:items-center smart:justify-center';

const ICON_BUTTON_CLASSES =
  'smart:inline-flex smart:size-7.5 smart:items-center smart:justify-center smart:rounded-xs smart:transition smart:duration-200 smart:ease-in-out smart:hover:bg-gray-100 smart:dark:hover:bg-white/10 smart:focus-visible:outline-1 smart:focus-visible:outline-blue-400 smart:disabled:opacity-50 smart:disabled:pointer-events-none';

const ACTIVE_CLASSES =
  'smart:bg-blue-50 smart:text-blue-600 smart:dark:bg-white/15 smart:dark:text-blue-300';

const SEPARATOR_CLASSES =
  'smart:mx-1.5 smart:border-l smart:border-gray-300 smart:dark:border-white/15';

const DROPDOWN_CLASSES =
  'smart:relative smart:flex smart:min-w-16 smart:shrink-0 smart:items-center smart:hover:bg-gray-100 smart:dark:hover:bg-white/10';

const DROPDOWN_TEXT_CLASSES =
  'smart:flex smart:h-full smart:w-full smart:items-center smart:justify-center smart:gap-x-6 smart:px-1.5 smart:text-sm smart:focus-visible:outline-1 smart:focus-visible:outline-blue-400 smart:disabled:opacity-50 smart:disabled:pointer-events-none';

const DROPDOWN_MENU_CLASSES =
  'smart:absolute smart:left-0 smart:top-full smart:z-10 smart:mt-0.5 smart:flex smart:w-full smart:flex-col smart:rounded-sm smart:bg-white smart:shadow-md smart:dark:bg-gray-800';

const DROPDOWN_ITEM_CLASSES =
  'smart:whitespace-nowrap smart:p-2 smart:text-left smart:text-sm smart:hover:bg-gray-100 smart:dark:hover:bg-white/10 smart:focus-visible:outline-1 smart:focus-visible:outline-blue-400';

const DROPDOWN_ACTIVE_CLASSES = 'smart:bg-blue-50 smart:dark:bg-white/15';

/** The popup of the menu that is open. */
type SmartRichTextPopup =
  'heading' | 'link' | 'image' | 'text_color' | 'background_color';

/** A menu icon. */
export function SmartRichTextIcon({ name }: { name: SmartRichTextIconName }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="20"
      width="20"
      aria-hidden="true"
    >
      {RICH_TEXT_ICONS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export interface SmartRichTextMenuProps {
  toolbar: SmartRichTextToolbar;
  state: SmartRichTextState;
  disabled?: boolean;
  onCommand: (command: SmartRichTextCommand) => void;
  /** The text selected in the editor, which a new link takes. */
  getSelectedText: () => string;
}

/**
 * The menu bar of `SmartRichTextEditor`: the toolbar's groups of items,
 * separated. Toggles press while their format is at the selection; headings
 * open a listbox, links, images and colours a popup.
 */
export function SmartRichTextMenu({
  toolbar,
  state,
  disabled = false,
  onCommand,
  getSelectedText,
}: SmartRichTextMenuProps) {
  const [open, setOpen] = useState<SmartRichTextPopup | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const openItemRef = useRef<HTMLDivElement>(null);

  // A press outside the open item closes its popup.
  useEffect(() => {
    if (!open) return undefined;

    const close = (e: Event) => {
      if (!openItemRef.current?.contains(e.target as Node)) setOpen(null);
    };

    document.addEventListener('mousedown', close);

    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  /** The ref of an item's container while its popup is open. */
  const itemRef = (popup: SmartRichTextPopup) =>
    open === popup ? openItemRef : undefined;

  const togglePopup = (popup: SmartRichTextPopup) =>
    setOpen((current) => (current === popup ? null : popup));

  const command = (next: SmartRichTextCommand) => {
    setOpen(null);
    onCommand(next);
  };

  const iconButton = (options: {
    label: string;
    icon: SmartRichTextIconName;
    active: boolean;
    popup?: SmartRichTextPopup;
    pressed?: boolean;
    onClick: () => void;
    children?: ReactNode;
  }) => (
    <div
      className={ITEM_CLASSES}
      ref={options.popup ? itemRef(options.popup) : undefined}
    >
      <button
        type="button"
        className={cn(ICON_BUTTON_CLASSES, options.active && ACTIVE_CLASSES)}
        title={options.label}
        aria-label={options.label}
        aria-pressed={options.pressed}
        aria-haspopup={options.popup ? 'dialog' : undefined}
        aria-expanded={options.popup ? open === options.popup : undefined}
        disabled={disabled}
        onMouseDown={keepEditorFocus}
        onClick={options.onClick}
      >
        <SmartRichTextIcon name={options.icon} />
      </button>
      {options.children}
    </div>
  );

  const headingDropdown = (levels: SmartRichTextHeading[]) => {
    const active = levels.find((level) => level === state.heading);
    const name = RICH_TEXT_LABELS[active ?? 'heading'];
    const expanded = open === 'heading';

    return (
      <div className={DROPDOWN_CLASSES} ref={itemRef('heading')}>
        <button
          type="button"
          className={cn(
            DROPDOWN_TEXT_CLASSES,
            (active || expanded) && ACTIVE_CLASSES,
          )}
          aria-label={name}
          aria-haspopup="listbox"
          aria-expanded={expanded}
          disabled={disabled}
          onMouseDown={keepEditorFocus}
          onClick={() => togglePopup('heading')}
        >
          {name}
          <svg
            className="smart:size-2"
            viewBox="0 0 8 4"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M0 0h8L4 4z" />
          </svg>
        </button>
        {expanded && (
          <div className={DROPDOWN_MENU_CLASSES} role="listbox">
            {levels.map((level) => (
              <button
                key={level}
                type="button"
                role="option"
                aria-selected={level === active}
                className={cn(
                  DROPDOWN_ITEM_CLASSES,
                  level === active && DROPDOWN_ACTIVE_CLASSES,
                )}
                onMouseDown={keepEditorFocus}
                onClick={() => command({ type: 'heading', level })}
              >
                {RICH_TEXT_LABELS[level]}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderItem = (item: SmartRichTextToolbarItem) => {
    if (typeof item === 'object') return headingDropdown(item.heading);

    if (item === 'link') {
      return iconButton({
        label: state.link
          ? RICH_TEXT_LABELS.removeLink
          : RICH_TEXT_LABELS.insertLink,
        icon: state.link ? 'unlink' : 'link',
        active: state.link || open === 'link',
        popup: 'link',
        onClick: () => {
          if (state.link) {
            command({ type: 'unlink' });

            return;
          }

          setSelectedText(getSelectedText());
          togglePopup('link');
        },
        children: open === 'link' && (
          <SmartRichTextLinkPopup
            selectedText={selectedText}
            onInsert={(link) => command({ type: 'link', ...link })}
          />
        ),
      });
    }

    if (item === 'image') {
      return iconButton({
        label: RICH_TEXT_LABELS.insertImage,
        icon: 'image',
        active: open === 'image',
        popup: 'image',
        onClick: () => togglePopup('image'),
        children: open === 'image' && (
          <SmartRichTextImagePopup
            onInsert={(image) => command({ type: 'image', ...image })}
          />
        ),
      });
    }

    if (item === 'text_color' || item === 'background_color') {
      return iconButton({
        label: RICH_TEXT_LABELS[item],
        icon: item === 'text_color' ? 'text_color' : 'color_fill',
        active: !!state[item] || open === item,
        popup: item,
        onClick: () => togglePopup(item),
        children: open === item && (
          <SmartRichTextColorPopup
            kind={item}
            active={state[item]}
            onSelect={(color) => command({ type: 'color', kind: item, color })}
            onRemove={() => command({ type: 'removeColor', kind: item })}
          />
        ),
      });
    }

    const pressed = !!state.toggles[item];

    return iconButton({
      label: RICH_TEXT_LABELS[item],
      icon: item,
      active: pressed,
      pressed,
      onClick: () => command({ type: 'toggle', item }),
    });
  };

  return (
    <div className={MENU_BAR_CLASSES}>
      {toolbar.map((group, groupIndex) =>
        group.map((item, itemIndex) => (
          <Fragment key={`${groupIndex}-${itemIndex}`}>
            {renderItem(item)}
            {itemIndex === group.length - 1 &&
              groupIndex !== toolbar.length - 1 && (
                <div
                  role="separator"
                  aria-orientation="vertical"
                  className={SEPARATOR_CLASSES}
                />
              )}
          </Fragment>
        )),
      )}
    </div>
  );
}
