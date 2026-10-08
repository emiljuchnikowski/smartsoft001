import { useEffect, useId, useRef, useState } from 'react';

import { cn } from '../../../utils/class-names';
import { SmartTextareaProps } from '../textarea.types';
import { useTextarea } from '../use-textarea';
import {
  SmartTextareaPresetVariant,
  TEXTAREA_ACTIONS,
  TEXTAREA_AVATAR,
  TEXTAREA_BODY,
  TEXTAREA_COUNTER,
  TEXTAREA_FOOTER,
  TEXTAREA_LABEL,
  TEXTAREA_PREVIEW_BELOW,
  TEXTAREA_PREVIEW_PANE,
  TEXTAREA_REQUIRED,
  TEXTAREA_ROOT,
  TEXTAREA_TABS,
  TEXTAREA_TOOLBAR,
  textareaActionClasses,
  textareaBarClasses,
  textareaBarInside,
  textareaFieldClasses,
  textareaFrameClasses,
  textareaTabClasses,
} from './preset-classes';

/**
 * Styled textarea variation (preset). Register it as `components.textarea` on
 * `SmartProvider` to restyle every `<SmartTextarea>`, or render it directly.
 *
 * Renders the Tailwind UI comment-form look and honours `options.variant`:
 * `simple` (outlined field, bar below), `with-avatar-actions` (outlined box
 * with the toolbar/actions bar inside), `with-underline` (bottom border only),
 * `with-pill-actions` (box with a divided bar and pill buttons) and
 * `with-preview` (Write / Preview tabs swapping the field for `previewTpl`).
 * It also focuses the field on mount for `autoFocus` and shows a character
 * counter for `maxLength`.
 */
export function SmartTextareaPreset(props: SmartTextareaProps) {
  const { placeholder = '', disabled = false, options, className } = props;
  const { value, setValue, actionClick } = useTextarea(props);

  const fieldId = 'smart-textarea-preset-' + useId();
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  const variant: SmartTextareaPresetVariant = options?.variant ?? 'simple';
  const actions = options?.actions ?? [];
  const hasBar = !!options?.toolbarTpl || actions.length > 0;
  const barInside = textareaBarInside(variant);
  const hasTabs = variant === 'with-preview' && !!options?.previewTpl;
  const showPreviewPane = hasTabs && mode === 'preview';

  // Angular's `afterNextRender`: focus once, after the first render.
  useEffect(() => {
    if (options?.autoFocus) fieldRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bar = (
    <div className={textareaBarClasses(variant)}>
      {options?.toolbarTpl && (
        <div className={TEXTAREA_TOOLBAR}>{options.toolbarTpl}</div>
      )}
      {actions.length > 0 && (
        <div className={TEXTAREA_ACTIONS}>
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className={textareaActionClasses(action.variant, variant)}
              data-action-id={action.id}
              aria-label={action.label ? undefined : action.id}
              disabled={disabled}
              onClick={() => actionClick(action.id)}
            >
              {action.iconTpl && (
                <span
                  className="smart:inline-flex smart:size-5"
                  aria-hidden="true"
                >
                  {action.iconTpl}
                </span>
              )}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn(TEXTAREA_ROOT, className)} data-variant={variant}>
      {options?.avatarTpl && (
        <div className={TEXTAREA_AVATAR}>{options.avatarTpl}</div>
      )}

      <div className={TEXTAREA_BODY}>
        {options?.label && (
          <label className={TEXTAREA_LABEL} htmlFor={fieldId}>
            {options.label}
            {options.required && (
              <span className={TEXTAREA_REQUIRED} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {hasTabs && (
          <div className={TEXTAREA_TABS} role="tablist">
            <button
              type="button"
              role="tab"
              className={textareaTabClasses(mode === 'write')}
              aria-selected={mode === 'write'}
              onClick={() => setMode('write')}
            >
              Write
            </button>
            <button
              type="button"
              role="tab"
              className={textareaTabClasses(mode === 'preview')}
              aria-selected={mode === 'preview'}
              onClick={() => setMode('preview')}
            >
              Preview
            </button>
          </div>
        )}

        {showPreviewPane ? (
          <div className={TEXTAREA_PREVIEW_PANE}>{options?.previewTpl}</div>
        ) : (
          <div className={textareaFrameClasses(variant)}>
            <textarea
              ref={fieldRef}
              id={fieldId}
              className={textareaFieldClasses(variant)}
              name={options?.name}
              placeholder={placeholder || undefined}
              aria-label={options?.ariaLabel}
              maxLength={options?.maxLength}
              rows={options?.rows ?? 3}
              disabled={disabled}
              required={!!options?.required}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            ></textarea>
            {hasBar && barInside && bar}
          </div>
        )}

        {hasBar && !barInside && bar}

        {options?.maxLength ? (
          <p className={TEXTAREA_COUNTER} aria-live="polite">
            {value.length}/{options.maxLength}
          </p>
        ) : null}

        {options?.previewTpl && !hasTabs && (
          <div className={TEXTAREA_PREVIEW_BELOW}>{options.previewTpl}</div>
        )}

        {options?.footerTpl && (
          <div className={TEXTAREA_FOOTER}>{options.footerTpl}</div>
        )}
      </div>
    </div>
  );
}
