// #region usage
import { useState } from 'react';

import {
  IProgressBarsOptions,
  IProgressStepClick,
  SmartProgressBars,
} from '@smartsoft001/react';

const options: IProgressBarsOptions = {
  layout: 'panels',
  ariaLabel: 'Checkout progress',
  steps: [
    { id: 'shipping', index: '01', name: 'Shipping', status: 'complete' },
    { id: 'payment', index: '02', name: 'Payment', status: 'current' },
    { id: 'review', index: '03', name: 'Review', status: 'upcoming' },
  ],
};

export function ProgressBarsUsageExample() {
  const [lastStep, setLastStep] = useState<string | null>(null);

  const onStepClick = ({ stepId }: IProgressStepClick) => setLastStep(stepId);

  return (
    <>
      <SmartProgressBars options={options} onStepClick={onStepClick} />
      {lastStep && <p>Last clicked step: {lastStep}</p>}
    </>
  );
}
// #endregion
