import { useId, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

import {
  RICH_TEXT_COLOR_PRESETS,
  RICH_TEXT_IMAGE_PATTERN,
  RICH_TEXT_LABELS,
  RICH_TEXT_LINK_PATTERN,
  SmartRichTextColorKind,
} from './rich-text-toolbar';
import { cn } from '../../../utils/class-names';

const POPUP_CLASSES =
  'smart:absolute smart:left-0 smart:top-full smart:z-10 smart:mt-0.5 smart:min-w-48 smart:rounded-sm smart:bg-white smart:p-2 smart:text-sm smart:text-gray-900 smart:shadow-md smart:dark:bg-gray-800 smart:dark:text-white';

const FORM_GROUP_CLASSES = 'smart:mb-2 smart:flex smart:flex-col';

const LABEL_CLASSES = 'smart:mb-0.5 smart:text-xs';

const INPUT_CLASSES =
  'smart:rounded-sm smart:border smart:border-gray-300 smart:bg-white smart:px-1 smart:py-0.5 smart:text-sm smart:text-gray-900 smart:dark:border-white/10 smart:dark:bg-white/5 smart:dark:text-white smart:disabled:opacity-50';

const ERROR_CLASSES =
  'smart:text-xs smart:text-red-600 smart:dark:text-red-400';

const SUBMIT_CLASSES =
  'smart:rounded-md smart:bg-indigo-600 smart:px-2.5 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-white smart:hover:bg-indigo-500 smart:disabled:opacity-50 smart:disabled:pointer-events-none';

const COLOR_CLASSES =
  'smart:size-6 smart:shrink-0 smart:rounded-md smart:border-none smart:text-xs smart:focus-visible:outline-1 smart:focus-visible:outline-offset-1 smart:focus-visible:outline-blue-400';

const REMOVE_CLASSES =
  'smart:mt-1.5 smart:rounded-md smart:border smart:border-gray-300 smart:px-2 smart:py-1 smart:text-sm smart:hover:bg-gray-100 smart:dark:border-white/10 smart:dark:hover:bg-white/10 smart:disabled:opacity-50 smart:disabled:pointer-events-none';

/** Keeps the focus (and so the selection) in the editor on a press. */
export const keepEditorFocus = (e: MouseEvent) => e.preventDefault();

/** Runs `submit` on Enter, without submitting a surrounding form. */
const onEnter = (submit: () => void) => (e: KeyboardEvent) => {
  if (e.key !== 'Enter') return;

  e.preventDefault();
  submit();
};

export interface SmartRichTextLink {
  href: string;
  text: string;
  openInNewTab: boolean;
}

/**
 * The link popup of the menu: URL, text (the selected text, locked, when there
 * is one) and whether the link opens in a new tab. Not a `<form>`: the field
 * usually sits in one.
 */
export function SmartRichTextLinkPopup({
  selectedText,
  onInsert,
}: {
  selectedText: string;
  onInsert: (link: SmartRichTextLink) => void;
}) {
  const id = useId();
  const [href, setHref] = useState('');
  const [text, setText] = useState(selectedText);
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [hrefTouched, setHrefTouched] = useState(false);
  const [textTouched, setTextTouched] = useState(false);
  const hrefValid = RICH_TEXT_LINK_PATTERN.test(href);
  const valid = hrefValid && !!text;

  const insert = () => {
    if (valid) onInsert({ href, text, openInNewTab });
  };

  return (
    <div
      role="dialog"
      aria-label={RICH_TEXT_LABELS.insertLink}
      className={POPUP_CLASSES}
    >
      <div className={FORM_GROUP_CLASSES}>
        <label htmlFor={`${id}-url`} className={LABEL_CLASSES}>
          {RICH_TEXT_LABELS.url}
        </label>
        <input
          id={`${id}-url`}
          type="url"
          autoComplete="off"
          className={INPUT_CLASSES}
          value={href}
          onChange={(e) => setHref(e.target.value)}
          onBlur={() => setHrefTouched(true)}
          onKeyDown={onEnter(insert)}
        />
        {hrefTouched && href && !hrefValid && (
          <div className={ERROR_CLASSES}>{RICH_TEXT_LABELS.enterValidUrl}</div>
        )}
      </div>
      <div className={FORM_GROUP_CLASSES}>
        <label htmlFor={`${id}-text`} className={LABEL_CLASSES}>
          {RICH_TEXT_LABELS.text}
        </label>
        <input
          id={`${id}-text`}
          type="text"
          autoComplete="off"
          className={INPUT_CLASSES}
          value={text}
          disabled={!!selectedText}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setTextTouched(true)}
          onKeyDown={onEnter(insert)}
        />
        {textTouched && !text && (
          <div className={ERROR_CLASSES}>{RICH_TEXT_LABELS.required}</div>
        )}
      </div>
      <div className={FORM_GROUP_CLASSES}>
        <label className="smart:flex smart:items-center smart:gap-x-1">
          <input
            type="checkbox"
            checked={openInNewTab}
            onChange={(e) => setOpenInNewTab(e.target.checked)}
          />
          {RICH_TEXT_LABELS.openInNewTab}
        </label>
      </div>
      <button
        type="button"
        className={SUBMIT_CLASSES}
        disabled={!valid}
        onClick={insert}
      >
        {RICH_TEXT_LABELS.insert}
      </button>
    </div>
  );
}

export interface SmartRichTextImage {
  src: string;
  alt: string;
  title: string;
}

/**
 * The image popup of the menu: the image URL, its alternative text and title.
 */
export function SmartRichTextImagePopup({
  onInsert,
}: {
  onInsert: (image: SmartRichTextImage) => void;
}) {
  const id = useId();
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [title, setTitle] = useState('');
  const [srcTouched, setSrcTouched] = useState(false);
  const valid = RICH_TEXT_IMAGE_PATTERN.test(src);

  const insert = () => {
    if (valid) onInsert({ src, alt, title });
  };

  return (
    <div
      role="dialog"
      aria-label={RICH_TEXT_LABELS.insertImage}
      className={POPUP_CLASSES}
    >
      <div className={FORM_GROUP_CLASSES}>
        <label htmlFor={`${id}-url`} className={LABEL_CLASSES}>
          {RICH_TEXT_LABELS.url}
        </label>
        <input
          id={`${id}-url`}
          type="url"
          autoComplete="off"
          className={INPUT_CLASSES}
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          onBlur={() => setSrcTouched(true)}
          onKeyDown={onEnter(insert)}
        />
        {srcTouched && src && !valid && (
          <div className={ERROR_CLASSES}>{RICH_TEXT_LABELS.enterValidUrl}</div>
        )}
      </div>
      <div className={FORM_GROUP_CLASSES}>
        <label htmlFor={`${id}-alt`} className={LABEL_CLASSES}>
          {RICH_TEXT_LABELS.altText}
        </label>
        <input
          id={`${id}-alt`}
          type="text"
          autoComplete="off"
          className={INPUT_CLASSES}
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onKeyDown={onEnter(insert)}
        />
      </div>
      <div className={FORM_GROUP_CLASSES}>
        <label htmlFor={`${id}-title`} className={LABEL_CLASSES}>
          {RICH_TEXT_LABELS.title}
        </label>
        <input
          id={`${id}-title`}
          type="text"
          autoComplete="off"
          className={INPUT_CLASSES}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={onEnter(insert)}
        />
      </div>
      <button
        type="button"
        className={SUBMIT_CLASSES}
        disabled={!valid}
        onClick={insert}
      >
        {RICH_TEXT_LABELS.insert}
      </button>
    </div>
  );
}

/** Black or white, whichever reads better on `hex`. */
export function getContrastYIQ(hex: string): 'black' | 'white' {
  const color = hex.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? 'black' : 'white';
}

const COLOR_ROWS = RICH_TEXT_COLOR_PRESETS.reduce<string[][]>(
  (rows, color, index) => {
    if (index % 8 === 0) rows.push([]);

    rows[rows.length - 1].push(color);

    return rows;
  },
  [],
);

/**
 * The colour popup of the menu: the presets in rows of 8, the colour of the
 * selection checked, and a button removing that colour.
 */
export function SmartRichTextColorPopup({
  kind,
  active,
  onSelect,
  onRemove,
}: {
  kind: SmartRichTextColorKind;
  /** The colour of the selection (`#rrggbb`), if any. */
  active: string | null;
  onSelect: (color: string) => void;
  onRemove: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-label={RICH_TEXT_LABELS[kind]}
      className={cn(POPUP_CLASSES, 'smart:w-57.5')}
    >
      {COLOR_ROWS.map((row, index) => (
        <div
          key={row[0]}
          className={cn(
            'smart:flex smart:justify-between',
            index > 0 && 'smart:mt-1.5',
          )}
        >
          {row.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              className={COLOR_CLASSES}
              style={{ backgroundColor: color, color: getContrastYIQ(color) }}
              onMouseDown={keepEditorFocus}
              onClick={() => onSelect(color)}
            >
              {color === active ? '✔' : null}
            </button>
          ))}
        </div>
      ))}
      <button
        type="button"
        className={REMOVE_CLASSES}
        disabled={!active}
        onMouseDown={keepEditorFocus}
        onClick={onRemove}
      >
        {RICH_TEXT_LABELS.remove}
      </button>
    </div>
  );
}
