import { ITextareaAction } from '../../../models';
import { SmartTextareaProps } from '../textarea.types';
import { useTextarea } from '../use-textarea';

const ACTION_CLASSES: Record<
  NonNullable<ITextareaAction['variant']>,
  string
> = {
  primary: 'action variant-primary',
  secondary: 'action variant-secondary',
  ghost: 'action variant-ghost',
};

/** The default, unstyled textarea. */
export function SmartTextareaStandard(props: SmartTextareaProps) {
  const { placeholder = '', disabled = false, options, className } = props;
  const { value, setValue, actionClick } = useTextarea(props);
  const actions = options?.actions ?? [];

  return (
    <div className={className}>
      <div className="textarea">
        {options?.label && <label>{options.label}</label>}
        {options?.avatarTpl && (
          <div className="avatar">{options.avatarTpl}</div>
        )}
        {options?.toolbarTpl && (
          <div className="toolbar">{options.toolbarTpl}</div>
        )}
        <textarea
          name={options?.name}
          placeholder={placeholder || undefined}
          aria-label={options?.ariaLabel}
          maxLength={options?.maxLength}
          rows={options?.rows ?? 3}
          disabled={disabled}
          required={options?.required ? true : undefined}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        ></textarea>
        {actions.length > 0 && (
          <div className="actions">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                className={ACTION_CLASSES[action.variant ?? 'secondary']}
                disabled={disabled}
                onClick={() => actionClick(action.id)}
              >
                {action.iconTpl && (
                  <span className="icon">{action.iconTpl}</span>
                )}
                {action.label}
              </button>
            ))}
          </div>
        )}
        {options?.previewTpl && (
          <div className="preview">{options.previewTpl}</div>
        )}
        {options?.footerTpl && (
          <div className="footer">{options.footerTpl}</div>
        )}
      </div>
    </div>
  );
}
