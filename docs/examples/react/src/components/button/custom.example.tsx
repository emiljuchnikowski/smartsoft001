// #region usage
import { useState } from 'react';

import {
  IButtonOptions,
  SmartButton,
  SmartButtonProps,
  SmartProvider,
  useButton,
} from '@smartsoft001/react';

export function CustomButton(props: SmartButtonProps) {
  const { disabled = false, className, children } = props;
  const { variantClasses, invoke } = useButton(props);

  return (
    <button
      type="button"
      className={['docs-button', ...variantClasses, className]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      onClick={invoke}
    >
      {children}
    </button>
  );
}

// A module constant: a new object on every render would change the context.
const components = { button: CustomButton };

export function ButtonCustomExample() {
  const [saved, setSaved] = useState(false);

  const options: IButtonOptions = {
    click: () => setSaved(true),
    variant: 'primary',
    color: 'indigo',
    size: 'md',
  };

  return (
    <SmartProvider components={components}>
      <SmartButton options={options}>Save</SmartButton>
      {saved && <p>Saved.</p>}
    </SmartProvider>
  );
}
// #endregion
