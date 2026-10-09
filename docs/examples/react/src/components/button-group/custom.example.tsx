// #region usage
import {
  IButtonGroupButton,
  SmartButtonGroup,
  SmartButtonGroupProps,
  SmartProvider,
  useButtonGroup,
} from '@smartsoft001/react';

export function CustomButtonGroup(props: SmartButtonGroupProps) {
  const { buttons = [], className } = props;
  const { selected, select } = useButtonGroup(props);

  return (
    <div
      role="group"
      className={['docs-button-group', className].filter(Boolean).join(' ')}
    >
      {buttons.map((button) => (
        <button
          key={button.id}
          type="button"
          className="docs-button-group__button"
          disabled={button.disabled ?? false}
          aria-pressed={selected === button.id}
          onClick={() => select(button.id)}
        >
          {button.label}

          {button.count !== undefined && (
            <span className="docs-button-group__count">{button.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'button-group': CustomButtonGroup };

const buttons: IButtonGroupButton[] = [
  { id: 'years', label: 'Years' },
  { id: 'month', label: 'Month' },
  { id: 'date', label: 'Date' },
];

export function ButtonGroupCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartButtonGroup buttons={buttons} defaultSelected="month" />
    </SmartProvider>
  );
}
// #endregion
