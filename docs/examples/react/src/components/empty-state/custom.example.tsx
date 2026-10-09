// #region usage
import {
  cn,
  IEmptyStateOptions,
  SmartEmptyState,
  SmartEmptyStateProps,
  SmartProvider,
} from '@smartsoft001/react';

export function CustomEmptyState({
  options,
  className,
  onActionClick,
}: SmartEmptyStateProps) {
  return (
    <div className={cn('docs-empty-state', className)}>
      {options?.title && (
        <h3 className="docs-empty-state__title">{options.title}</h3>
      )}
      {options?.description && (
        <p className="docs-empty-state__description">{options.description}</p>
      )}
      {(options?.actions ?? []).map((action) => (
        <button
          key={action.id}
          type="button"
          className="docs-empty-state__action"
          data-variant={action.variant ?? 'primary'}
          onClick={() => onActionClick?.({ actionId: action.id })}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'empty-state': CustomEmptyState };

const options: IEmptyStateOptions = {
  title: 'No draft invoices',
  description: 'Draft an invoice and send it to a customer.',
  actions: [
    { id: 'create', label: 'Create a new invoice', variant: 'primary' },
    { id: 'template', label: 'Use a template', variant: 'secondary' },
  ],
};

export function EmptyStateCustomExample() {
  // Every SmartEmptyState below the provider renders CustomEmptyState.
  return (
    <SmartProvider components={components}>
      <SmartEmptyState options={options} />
    </SmartProvider>
  );
}
// #endregion
