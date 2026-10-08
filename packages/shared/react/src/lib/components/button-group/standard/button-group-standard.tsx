import { SmartButtonGroupProps } from '../button-group.types';
import { useButtonGroup } from '../use-button-group';

/**
 * The default button group rendering (`<smart-button-group-standard>`): an
 * unstyled `role="group"` of toggle buttons with their label and count.
 */
export function SmartButtonGroupStandard(props: SmartButtonGroupProps) {
  const { buttons = [], className } = props;
  const { selected, select } = useButtonGroup(props);

  return (
    <div role="group" className={className || undefined}>
      {buttons.map((btn) => (
        <button
          key={btn.id}
          type="button"
          disabled={btn.disabled}
          aria-pressed={selected === btn.id}
          onClick={() => select(btn.id)}
        >
          {btn.label && (
            <span className="smart-button-group-label">{btn.label}</span>
          )}
          {btn.count != null && (
            <span className="smart-button-group-count">{btn.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
