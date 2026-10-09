// #region usage
import {
  ITextareaOptions,
  SmartProvider,
  SmartTextarea,
  SmartTextareaProps,
  useTextarea,
} from '@smartsoft001/react';

export function CustomTextarea(props: SmartTextareaProps) {
  const { placeholder, disabled = false, options, className } = props;
  // useTextarea keeps the text (controlled or internal), reports edits through
  // onValueChange and actions through onActionClick, ignoring them while
  // disabled.
  const { value, setValue, actionClick } = useTextarea(props);
  const actions = options?.actions ?? [];
  const containerClasses = [
    'docs-textarea',
    `docs-textarea--${options?.variant ?? 'simple'}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {options?.label && (
        <label className="docs-textarea__label" htmlFor={options.name}>
          {options.label}
          {options.required && (
            <span className="docs-textarea__required">*</span>
          )}
        </label>
      )}

      <textarea
        className="docs-textarea__field"
        id={options?.name}
        name={options?.name}
        placeholder={placeholder || undefined}
        maxLength={options?.maxLength}
        rows={options?.rows ?? 3}
        disabled={disabled}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />

      {actions.length > 0 && (
        <div className="docs-textarea__actions">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="docs-textarea__action"
              data-variant={action.variant ?? 'secondary'}
              disabled={disabled}
              onClick={() => actionClick(action.id)}
            >
              {action.label ?? action.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { textarea: CustomTextarea };

const options: ITextareaOptions = {
  label: 'Comment',
  name: 'comment',
  rows: 4,
  maxLength: 280,
  required: true,
  variant: 'with-pill-actions',
  actions: [
    { id: 'cancel', label: 'Cancel', variant: 'ghost' },
    { id: 'submit', label: 'Send', variant: 'primary' },
  ],
};

// Every <SmartTextarea> below the provider renders CustomTextarea. Without
// value the text lives in the implementation and starts at defaultValue.
export function TextareaCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartTextarea
        defaultValue="Looks good to me."
        placeholder="Add your comment..."
        options={options}
      />
    </SmartProvider>
  );
}
// #endregion
