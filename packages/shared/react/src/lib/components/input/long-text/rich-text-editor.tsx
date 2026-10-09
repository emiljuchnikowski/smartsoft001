import { useCallback, useEffect, useRef, useState } from 'react';

import {
  applyRichTextCommand,
  EMPTY_RICH_TEXT_STATE,
  execCommand,
  getEditorRange,
  getRichTextState,
  isSameRichTextState,
  restoreRange,
  SmartRichTextCommand,
  SmartRichTextState,
} from './rich-text-commands';
import { SmartRichTextMenu } from './rich-text-menu';
import { LONG_TEXT_TOOLBAR, SmartRichTextToolbar } from './rich-text-toolbar';
import { toInnerHtml } from '../../../utils/html';

// The content styles (padding, paragraph spacing, quotes), plus the list,
// heading, code and link looks Tailwind's preflight resets.
const CONTENT_CLASSES = [
  'smart:min-h-45',
  'smart:p-2',
  'smart:whitespace-pre-wrap',
  'smart:outline-none',
  'smart:[&_p]:mb-2.5',
  'smart:[&_blockquote]:border-l-3',
  'smart:[&_blockquote]:border-gray-300',
  'smart:[&_blockquote]:pl-4',
  'smart:dark:[&_blockquote]:border-white/20',
  'smart:[&_ul]:list-disc',
  'smart:[&_ul]:pl-6',
  'smart:[&_ol]:list-decimal',
  'smart:[&_ol]:pl-6',
  'smart:[&_h1]:text-2xl',
  'smart:[&_h1]:font-bold',
  'smart:[&_h2]:text-xl',
  'smart:[&_h2]:font-bold',
  'smart:[&_h3]:text-lg',
  'smart:[&_h3]:font-semibold',
  'smart:[&_h4]:font-semibold',
  'smart:[&_h5]:text-sm',
  'smart:[&_h5]:font-semibold',
  'smart:[&_h6]:text-xs',
  'smart:[&_h6]:font-semibold',
  'smart:[&_code]:rounded-sm',
  'smart:[&_code]:bg-gray-100',
  'smart:[&_code]:px-1',
  'smart:[&_code]:font-mono',
  'smart:dark:[&_code]:bg-white/10',
  'smart:[&_a]:text-indigo-600',
  'smart:[&_a]:underline',
  'smart:dark:[&_a]:text-indigo-400',
].join(' ');

const PLACEHOLDER_CLASSES =
  'smart:pointer-events-none smart:absolute smart:left-2 smart:top-2 smart:select-none smart:text-gray-500 smart:dark:text-gray-400';

/** Whether `html` shows nothing: no text and no image. */
function isEmptyHtml(html: string): boolean {
  return !html
    .replace(/<(?!img\b)[^>]*>/gi, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export interface SmartRichTextEditorProps {
  /** The HTML to edit; rendered sanitised when it does not come from here. */
  value?: string | null;
  placeholder?: string;
  disabled?: boolean;
  /** The menu; `LONG_TEXT_TOOLBAR` by default. */
  toolbar?: SmartRichTextToolbar;
  /** The id of the element labelling the editor. */
  labelledBy?: string;
  /** Called with the HTML of the content after every change. */
  onChange?: (html: string) => void;
  onBlur?: () => void;
}

/**
 * A dependency-free rich-text editor: a menu bar over a `contentEditable`
 * element whose HTML is the value. The menu runs its commands through
 * `document.execCommand` on the last selection made in the editor.
 */
export function SmartRichTextEditor({
  value,
  placeholder,
  disabled = false,
  toolbar = LONG_TEXT_TOOLBAR,
  labelledBy,
  onChange,
  onBlur,
}: SmartRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<Range | null>(null);
  const emittedRef = useRef(value ?? '');
  const [initialHtml] = useState(() => toInnerHtml(value));
  const [empty, setEmpty] = useState(() => isEmptyHtml(initialHtml.__html));
  const [state, setState] = useState<SmartRichTextState>(EMPTY_RICH_TEXT_STATE);

  const refreshState = useCallback(() => {
    const editor = editorRef.current;

    if (!editor) return;

    const next = getRichTextState(editor, rangeRef.current);

    setState((current) =>
      isSameRichTextState(current, next) ? current : next,
    );
  }, []);

  // Remember the last selection made in the editor: the menu (and its
  // popups) take the focus, the commands run on that selection.
  useEffect(() => {
    const onSelectionChange = () => {
      const editor = editorRef.current;
      const range = editor && getEditorRange(editor);

      if (!range) return;

      rangeRef.current = range;
      refreshState();
    };

    document.addEventListener('selectionchange', onSelectionChange);

    return () =>
      document.removeEventListener('selectionchange', onSelectionChange);
  }, [refreshState]);

  // A value that did not come from the editor (a reset, a patch) replaces
  // the content, sanitised as the initial one.
  useEffect(() => {
    const editor = editorRef.current;

    if (!editor || (value ?? '') === emittedRef.current) return;

    emittedRef.current = value ?? '';
    editor.innerHTML = toInnerHtml(value).__html;
    setEmpty(isEmptyHtml(editor.innerHTML));
  }, [value]);

  const emit = () => {
    const editor = editorRef.current;

    if (!editor) return;

    const html = editor.innerHTML;

    setEmpty(isEmptyHtml(html));

    if (html === emittedRef.current) return;

    emittedRef.current = html;
    onChange?.(html);
  };

  const run = (command: SmartRichTextCommand) => {
    const editor = editorRef.current;

    if (!editor || disabled) return;

    const range = getEditorRange(editor) ?? rangeRef.current;

    editor.focus();
    restoreRange(range);
    applyRichTextCommand(editor, range, command);
    rangeRef.current = getEditorRange(editor) ?? range;
    emit();
    refreshState();
  };

  const getSelectedText = () => {
    const editor = editorRef.current;
    const range = editor && (getEditorRange(editor) ?? rangeRef.current);

    return range ? range.toString() : '';
  };

  return (
    <>
      <SmartRichTextMenu
        toolbar={toolbar}
        state={state}
        disabled={disabled}
        onCommand={run}
        getSelectedText={getSelectedText}
      />
      <div className="smart:relative">
        {empty && (
          <div aria-hidden="true" className={PLACEHOLDER_CLASSES}>
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          aria-labelledby={labelledBy}
          aria-placeholder={placeholder}
          aria-disabled={disabled || undefined}
          contentEditable={!disabled}
          className={CONTENT_CLASSES}
          dangerouslySetInnerHTML={initialHtml}
          // Enter starts a new paragraph (`<p>`).
          onFocus={() => execCommand('defaultParagraphSeparator', 'p')}
          onInput={emit}
          onBlur={onBlur}
        />
      </div>
    </>
  );
}
