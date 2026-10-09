// #region usage
import { useState } from 'react';

import {
  ISelectMenuOptions,
  SelectMenuValue,
  SmartSelectMenu,
} from '@smartsoft001/react';

const options: ISelectMenuOptions = {
  placeholder: 'Choose a plan',
  ariaLabel: 'Subscription plan',
  items: [
    { value: 'starter', label: 'Starter' },
    { value: 'pro', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ],
};

export function SelectMenuUsageExample() {
  const [plan, setPlan] = useState<SelectMenuValue>(null);

  return (
    <>
      <SmartSelectMenu options={options} value={plan} onValueChange={setPlan} />
      {plan && <p>Selected plan: {plan}</p>}
    </>
  );
}
// #endregion
