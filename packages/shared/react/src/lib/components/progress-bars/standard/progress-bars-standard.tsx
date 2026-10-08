import type { CSSProperties } from 'react';

import { IProgressStep, SmartProgressStepStatus } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartNavLink } from '../../navbar/nav-link';
import { SmartProgressBarsProps } from '../progress-bars.types';

// Explicit literals (the Angular `'status-' + status`), so class scanners find them.
const STATUS_CLASSES: Record<SmartProgressStepStatus, string> = {
  complete: 'status-complete',
  current: 'status-current',
  upcoming: 'status-upcoming',
};

/**
 * The default progress bars rendering (`<smart-progress-bars-standard>`): the
 * steps as a `<nav>` list, or a progress bar for the `progress-bar` layout.
 */
export function SmartProgressBarsStandard({
  options,
  className,
  onStepClick,
}: SmartProgressBarsProps) {
  const renderStepBody = (step: IProgressStep) => (
    <>
      {step.iconTpl ? (
        <span className="progress-bars-step-icon">{step.iconTpl}</span>
      ) : step.index ? (
        <span className="progress-bars-step-index">{step.index}</span>
      ) : null}
      {step.name && (
        <span className="progress-bars-step-name">{step.name}</span>
      )}
      {step.description && (
        <span className="progress-bars-step-description">
          {step.description}
        </span>
      )}
    </>
  );

  if (options?.layout === 'progress-bar') {
    const value = Math.max(0, Math.min(100, options.value ?? 0));
    const columns = options.columns ?? [];

    return (
      <div className={cn('progress-bars-bar-wrapper', className)}>
        {options.srOnlyTitle && (
          <h4 className="sr-only">{options.srOnlyTitle}</h4>
        )}
        {options.title && (
          <p className="progress-bars-title">{options.title}</p>
        )}
        <div className="progress-bars-track" aria-hidden="true">
          <div
            className="progress-bars-fill"
            style={{ width: value + '%' }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        {columns.length > 0 && (
          <div
            className="progress-bars-columns"
            style={{ '--progress-columns': columns.length } as CSSProperties}
          >
            {columns.map((col) => (
              <div
                key={col.label}
                className={cn('progress-bars-column', col.active && 'active')}
              >
                {col.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <nav
      className={cn('progress-bars', className)}
      data-layout={options?.layout ?? 'simple'}
      aria-label={options?.ariaLabel ?? 'Progress'}
    >
      {options?.title && <p className="progress-bars-title">{options.title}</p>}
      <ol role="list" className="progress-bars-list">
        {(options?.steps ?? []).map((step) => {
          const status = step.status ?? 'upcoming';
          const current = step.status === 'current';

          return (
            <li
              key={step.id}
              className={cn('progress-bars-step', STATUS_CLASSES[status])}
              data-status={status}
            >
              {step.href ? (
                <SmartNavLink
                  href={step.href}
                  className={cn(
                    'progress-bars-step-link',
                    current && 'current',
                  )}
                  aria-current={current ? 'step' : undefined}
                >
                  {renderStepBody(step)}
                </SmartNavLink>
              ) : (
                <button
                  type="button"
                  className={cn(
                    'progress-bars-step-button',
                    current && 'current',
                  )}
                  aria-current={current ? 'step' : undefined}
                  onClick={() => onStepClick?.({ stepId: step.id })}
                >
                  {renderStepBody(step)}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
