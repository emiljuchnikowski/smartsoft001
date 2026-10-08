import {
  SmartRichTextColorKind,
  SmartRichTextHeading,
  SmartRichTextToggle,
} from './rich-text-toolbar';
import { escapeHtml } from '../../../utils/html';

/** What a menu item asks the editor to do. */
export type SmartRichTextCommand =
  | { type: 'toggle'; item: SmartRichTextToggle }
  | { type: 'heading'; level: SmartRichTextHeading }
  | { type: 'link'; href: string; text: string; openInNewTab: boolean }
  | { type: 'unlink' }
  | { type: 'image'; src: string; alt: string; title: string }
  | { type: 'color'; kind: SmartRichTextColorKind; color: string }
  | { type: 'removeColor'; kind: SmartRichTextColorKind };

/** The formats at the selection, which press the menu buttons. */
export interface SmartRichTextState {
  toggles: Partial<Record<SmartRichTextToggle, boolean>>;
  heading: SmartRichTextHeading | null;
  link: boolean;
  text_color: string | null;
  background_color: string | null;
}

export const EMPTY_RICH_TEXT_STATE: SmartRichTextState = {
  toggles: {},
  heading: null,
  link: false,
  text_color: null,
  background_color: null,
};

/** The `document.execCommand` command of the toggles the browser handles. */
const EXEC_COMMANDS: Partial<Record<SmartRichTextToggle, string>> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strike: 'strikeThrough',
  ordered_list: 'insertOrderedList',
  bullet_list: 'insertUnorderedList',
  align_left: 'justifyLeft',
  align_center: 'justifyCenter',
  align_right: 'justifyRight',
  align_justify: 'justifyFull',
};

/** `document.execCommand`, where the document has it. */
export function execCommand(command: string, value?: string): boolean {
  if (typeof document.execCommand !== 'function') return false;

  return document.execCommand(command, false, value);
}

function queryCommandState(command: string): boolean {
  if (typeof document.queryCommandState !== 'function') return false;

  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
}

/** The element matching `selector` around the start of `range`, in `editor`. */
function closestInEditor(
  editor: HTMLElement,
  range: Range | null,
  selector: string,
): HTMLElement | null {
  const node = range?.startContainer ?? null;
  const element =
    node && node.nodeType === 1 ? (node as Element) : node?.parentElement;
  const found = element?.closest<HTMLElement>(selector) ?? null;

  return found && found !== editor && editor.contains(found) ? found : null;
}

/** Replaces `element` with its children. */
function unwrap(element: HTMLElement): void {
  element.replaceWith(...Array.from(element.childNodes));
}

const BLOCK_SELECTOR = 'p, div, h1, h2, h3, h4, h5, h6, ul, ol, pre';

/** Replaces a block with its blocks, or with a paragraph of its text. */
function liftBlock(element: HTMLElement): void {
  const hasBlocks = Array.from(element.children).some((child) =>
    child.matches(BLOCK_SELECTOR),
  );

  if (hasBlocks) {
    unwrap(element);

    return;
  }

  const paragraph = element.ownerDocument.createElement('p');

  paragraph.append(...Array.from(element.childNodes));
  element.replaceWith(paragraph);
}

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6';

/** The colour an element gives its text or background, if any. */
function colorOf(element: HTMLElement, kind: SmartRichTextColorKind): string {
  return kind === 'text_color'
    ? element.style.color || element.getAttribute('color') || ''
    : element.style.backgroundColor;
}

/** The innermost element colouring the start of `range`, in `editor`. */
function findColorElement(
  editor: HTMLElement,
  range: Range | null,
  kind: SmartRichTextColorKind,
): HTMLElement | null {
  const node = range?.startContainer ?? null;
  let element =
    node && node.nodeType === 1 ? (node as HTMLElement) : node?.parentElement;

  while (element && element !== editor && editor.contains(element)) {
    if (colorOf(element, kind)) return element;

    element = element.parentElement;
  }

  return null;
}

/** Drops the colour of `element`, and the element when it held only that. */
function removeColor(element: HTMLElement, kind: SmartRichTextColorKind) {
  if (kind === 'text_color') {
    element.style.removeProperty('color');
    element.removeAttribute('color');
  } else {
    element.style.removeProperty('background-color');
  }

  if (!element.getAttribute('style')) element.removeAttribute('style');

  if (/^(SPAN|FONT)$/.test(element.tagName) && !element.attributes.length) {
    unwrap(element);
  }
}

/** `rgb(182, 2, 5)` -> `#b60205`; other colours lower-cased. */
export function toHexColor(color: string): string {
  const match = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(color);

  if (!match) return color.toLowerCase();

  return `#${match
    .slice(1, 4)
    .map((channel) => Number(channel).toString(16).padStart(2, '0'))
    .join('')}`;
}

/** The selected range, when it lies in `editor`. */
export function getEditorRange(editor: HTMLElement): Range | null {
  const selection = document.getSelection();

  if (!selection || !selection.rangeCount) return null;

  const range = selection.getRangeAt(0);

  return editor.contains(range.commonAncestorContainer)
    ? range.cloneRange()
    : null;
}

/** Selects `range` again (after the focus left the editor). */
export function restoreRange(range: Range | null): void {
  const selection = document.getSelection();

  if (!range || !selection) return;

  selection.removeAllRanges();
  selection.addRange(range);
}

/** The formats at `range` in `editor`. */
export function getRichTextState(
  editor: HTMLElement,
  range: Range | null,
): SmartRichTextState {
  if (!range) return EMPTY_RICH_TEXT_STATE;

  const toggles: SmartRichTextState['toggles'] = {};

  for (const [item, command] of Object.entries(EXEC_COMMANDS)) {
    toggles[item as SmartRichTextToggle] = queryCommandState(command);
  }

  toggles.code = !!closestInEditor(editor, range, 'code');
  toggles.blockquote = !!closestInEditor(editor, range, 'blockquote');

  const heading = closestInEditor(editor, range, HEADING_SELECTOR);
  const color = (kind: SmartRichTextColorKind) => {
    const element = findColorElement(editor, range, kind);

    return element ? toHexColor(colorOf(element, kind)) : null;
  };

  return {
    ...EMPTY_RICH_TEXT_STATE,
    toggles,
    link: !!closestInEditor(editor, range, 'a'),
    heading: heading
      ? (heading.tagName.toLowerCase() as SmartRichTextHeading)
      : null,
    text_color: color('text_color'),
    background_color: color('background_color'),
  };
}

/** Whether two states press the same buttons. */
export function isSameRichTextState(
  a: SmartRichTextState,
  b: SmartRichTextState,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function toggle(
  editor: HTMLElement,
  range: Range | null,
  item: SmartRichTextToggle,
): void {
  if (item === 'code') {
    const code = closestInEditor(editor, range, 'code');

    if (code) unwrap(code);
    else if (range && !range.collapsed)
      execCommand('insertHTML', `<code>${escapeHtml(range.toString())}</code>`);

    return;
  }

  if (item === 'blockquote') {
    const quote = closestInEditor(editor, range, 'blockquote');

    if (quote) liftBlock(quote);
    else execCommand('formatBlock', 'blockquote');

    return;
  }

  const exec = EXEC_COMMANDS[item];

  if (exec) execCommand(exec);
}

/**
 * Runs `command` on the selection of `editor`. Formats the browser has a
 * command for go through `document.execCommand`, links and images are
 * inserted as escaped HTML; removing code, quotes, links and colours edits
 * the DOM directly. Choosing the active heading again turns it back into a paragraph,
 * as in `ngx-editor`.
 */
export function applyRichTextCommand(
  editor: HTMLElement,
  range: Range | null,
  command: SmartRichTextCommand,
): void {
  switch (command.type) {
    case 'toggle':
      toggle(editor, range, command.item);

      return;
    case 'heading': {
      const active = closestInEditor(editor, range, HEADING_SELECTOR);

      execCommand(
        'formatBlock',
        active?.tagName.toLowerCase() === command.level ? 'p' : command.level,
      );

      return;
    }
    case 'link': {
      const href = escapeHtml(command.href);
      const target = command.openInNewTab ? '_blank' : '_self';

      execCommand(
        'insertHTML',
        `<a href="${href}" title="${href}" target="${target}">${escapeHtml(command.text)}</a>`,
      );

      return;
    }
    case 'unlink': {
      const link = closestInEditor(editor, range, 'a');

      if (link) unwrap(link);

      return;
    }
    case 'image':
      execCommand(
        'insertHTML',
        `<img src="${escapeHtml(command.src)}" alt="${escapeHtml(command.alt)}" title="${escapeHtml(command.title)}">`,
      );

      return;
    case 'color':
      if (command.kind === 'text_color') {
        execCommand('foreColor', command.color);
      } else if (!execCommand('hiliteColor', command.color)) {
        execCommand('backColor', command.color);
      }

      return;
    case 'removeColor': {
      const element = findColorElement(editor, range, command.kind);

      if (element) removeColor(element, command.kind);

      return;
    }
  }
}
