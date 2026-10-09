import { IActionPanelAction } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartActionPanelProps } from '../action-panel.types';

type ActionVariant = NonNullable<IActionPanelAction['variant']>;

const VARIANT_CLASSES: Record<ActionVariant, string> = {
  primary: 'variant-primary',
  secondary: 'variant-secondary',
  ghost: 'variant-ghost',
  link: 'variant-link',
};

/**
 * The default action panel: a `section.action-panel` with the title, the
 * description (or `options.descriptionTpl`), `options.contentTpl` and the
 * actions. Actions with `href` render as links (variant `link` by default), the
 * others as buttons (variant `primary` by default) calling `onActionClick`.
 */
export function SmartActionPanelStandard({
  options,
  className = '',
  onActionClick,
}: SmartActionPanelProps) {
  const actions = options?.actions ?? [];

  return (
    <div className={className || undefined}>
      <section className="action-panel">
        {options?.title && <h3>{options.title}</h3>}
        {options?.descriptionTpl ? (
          <div className="description">{options.descriptionTpl}</div>
        ) : (
          options?.description && (
            <p className="description">{options.description}</p>
          )
        )}
        {options?.contentTpl && (
          <div className="content">{options.contentTpl}</div>
        )}
        {actions.length > 0 && (
          <div className="actions">
            {actions.map((action) => {
              const icon = action.iconTpl && (
                <span className="icon">{action.iconTpl}</span>
              );

              return action.href ? (
                <a
                  key={action.id}
                  href={action.href}
                  className={cn(
                    'action',
                    VARIANT_CLASSES[action.variant ?? 'link'],
                  )}
                >
                  {icon}
                  {action.label}
                </a>
              ) : (
                <button
                  key={action.id}
                  type="button"
                  className={cn(
                    'action',
                    VARIANT_CLASSES[action.variant ?? 'primary'],
                  )}
                  onClick={() => onActionClick?.({ actionId: action.id })}
                >
                  {icon}
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
