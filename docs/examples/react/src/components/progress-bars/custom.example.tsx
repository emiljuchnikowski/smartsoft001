// #region usage
import { useState } from 'react';

import {
  cn,
  IProgressBarsOptions,
  SmartProgressBars,
  SmartProgressBarsProps,
  SmartProvider,
} from '@smartsoft001/react';

// There is no progress bars hook: the custom component takes the same props
// as SmartProgressBars and renders them its own way.
export function CustomProgressBars({
  options,
  className,
  onStepClick,
}: SmartProgressBarsProps) {
  return (
    <div
      className={cn('docs-progress-bars', className)}
      aria-label={options?.ariaLabel}
    >
      {options?.title && (
        <p className="docs-progress-bars__title">{options.title}</p>
      )}

      {options?.value !== undefined && (
        <div className="docs-progress-bars__track">
          <div
            className="docs-progress-bars__value"
            style={{ width: `${options.value}%` }}
          ></div>
        </div>
      )}

      <ol className="docs-progress-bars__steps">
        {(options?.steps ?? []).map((step) => (
          <li key={step.id}>
            <button
              type="button"
              className={cn(
                'docs-progress-bars__step',
                `docs-progress-bars__step--${step.status ?? 'upcoming'}`,
              )}
              aria-current={step.status === 'current' ? 'step' : undefined}
              onClick={() => onStepClick?.({ stepId: step.id })}
            >
              <span className="docs-progress-bars__index">{step.index}</span>
              <span className="docs-progress-bars__name">{step.name}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'progress-bars': CustomProgressBars };

const options: IProgressBarsOptions = {
  title: 'Uploading files',
  ariaLabel: 'Upload progress',
  value: 50,
  steps: [
    { id: 'account', name: 'Account', index: '1', status: 'complete' },
    { id: 'profile', name: 'Profile', index: '2', status: 'current' },
    { id: 'review', name: 'Review', index: '3', status: 'upcoming' },
  ],
};

export function ProgressBarsCustomExample() {
  const [lastStep, setLastStep] = useState<string | null>(null);

  // Every SmartProgressBars below the provider renders CustomProgressBars,
  // which receives the same props, onStepClick included.
  return (
    <SmartProvider components={components}>
      <SmartProgressBars
        options={options}
        onStepClick={({ stepId }) => setLastStep(stepId)}
      />
      {lastStep && <p>Last clicked step: {lastStep}</p>}
    </SmartProvider>
  );
}
// #endregion
