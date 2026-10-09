// #region usage
import {
  IActionPanelOptions,
  SmartActionPanel,
  SmartActionPanelProps,
  SmartProvider,
} from '@smartsoft001/react';

export function CustomActionPanel({
  options,
  className,
  onActionClick,
}: SmartActionPanelProps) {
  return (
    <section
      className={['docs-action-panel', className].filter(Boolean).join(' ')}
    >
      {options?.title && (
        <h3 className="docs-action-panel__title">{options.title}</h3>
      )}
      {options?.description && (
        <p className="docs-action-panel__description">{options.description}</p>
      )}
      {(options?.actions ?? []).map((action) => (
        <button
          key={action.id}
          type="button"
          className="docs-action-panel__action"
          onClick={() => onActionClick?.({ actionId: action.id })}
        >
          {action.label}
        </button>
      ))}
    </section>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'action-panel': CustomActionPanel };

const options: IActionPanelOptions = {
  layout: 'simple',
  title: 'Transfer ownership',
  description: 'Move this project to another workspace member.',
  actions: [
    { id: 'transfer', label: 'Transfer', variant: 'primary' },
    { id: 'cancel', label: 'Cancel' },
  ],
};

export function ActionPanelCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartActionPanel options={options} />
    </SmartProvider>
  );
}
// #endregion
