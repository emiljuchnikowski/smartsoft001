import { Fragment } from 'react';

import {
  IProgressStep,
  SmartProgressBarsLayout,
  SmartProgressStepStatus,
} from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartNavLink } from '../../navbar/nav-link';
import { SmartProgressBarsProps } from '../progress-bars.types';
import {
  getProgressBarsColumnClasses,
  getProgressBarsConnectorClasses,
  getProgressBarsListClasses,
  getProgressBarsMarkerClasses,
  getProgressBarsNameClasses,
  getProgressBarsStepClasses,
  isProgressBarsBullet,
  isProgressBarsCircle,
  isProgressBarsPanel,
  isProgressBarsSimple,
  isProgressBarsVertical,
  PROGRESS_BARS_CHECK_ICON,
  PROGRESS_BARS_COLUMNS,
  PROGRESS_BARS_DESCRIPTION,
  PROGRESS_BARS_FILL,
  PROGRESS_BARS_HEADER,
  PROGRESS_BARS_INDEX,
  PROGRESS_BARS_NAV,
  PROGRESS_BARS_STEP_BUTTON,
  PROGRESS_BARS_STEP_LINK,
  PROGRESS_BARS_STEPPER_TITLE,
  PROGRESS_BARS_TITLE,
  PROGRESS_BARS_TRACK,
  PROGRESS_BARS_VALUE_LABEL,
  PROGRESS_BARS_WRAPPER,
} from './preset-classes';

/**
 * Styled progress bars variation (preset). Register it as
 * `components['progress-bars']` on `SmartProvider` to restyle every
 * `<SmartProgressBars>`, or render it directly.
 *
 * Two modes off the shared `IProgressBarsOptions`: the percentage
 * `progress-bar` layout (track and fill, optional title with the value label
 * and column captions), and the step lists (`simple`, `panels`,
 * `panels-with-border`, `bullets`, `bullets-and-text`, `circles`,
 * `circles-with-text`), with connectors between the steps of the horizontal
 * circle and bullet rows.
 */
export function SmartProgressBarsPreset({
  options,
  className,
  onStepClick,
}: SmartProgressBarsProps) {
  const layout: SmartProgressBarsLayout = options?.layout ?? 'simple';
  const ariaLabel = options?.ariaLabel ?? 'Progress';
  const title = options?.title;

  if (layout === 'progress-bar') {
    const value = Math.max(0, Math.min(100, options?.value ?? 0));
    const columns = options?.columns ?? [];

    return (
      <div className={cn(PROGRESS_BARS_WRAPPER, className)}>
        {options?.srOnlyTitle && (
          <h4 className="smart:sr-only">{options.srOnlyTitle}</h4>
        )}
        {title && (
          <div className={PROGRESS_BARS_HEADER}>
            <h3 className={PROGRESS_BARS_TITLE}>{title}</h3>
            <span className={PROGRESS_BARS_VALUE_LABEL}>{value}%</span>
          </div>
        )}
        <div
          className={PROGRESS_BARS_TRACK}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={ariaLabel}
        >
          <div className={PROGRESS_BARS_FILL} style={{ width: value + '%' }} />
        </div>
        {columns.length > 0 && (
          <div
            className={PROGRESS_BARS_COLUMNS}
            style={{
              gridTemplateColumns:
                'repeat(' + (columns.length || 1) + ', minmax(0, 1fr))',
            }}
          >
            {columns.map((col) => (
              <div
                key={col.label}
                className={
                  getProgressBarsColumnClasses(Boolean(col.active)) || undefined
                }
              >
                {col.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const steps = options?.steps ?? [];
  const isCircle = isProgressBarsCircle(layout);
  const showMarker = !isProgressBarsSimple(layout);
  // Connectors only make sense for horizontal circle/bullet rows.
  const hasConnectors =
    !isProgressBarsVertical(layout) &&
    !isProgressBarsSimple(layout) &&
    !isProgressBarsPanel(layout) &&
    (isCircle || isProgressBarsBullet(layout));

  const renderStepBody = (step: IProgressStep, idx: number) => {
    const status: SmartProgressStepStatus = step.status ?? 'upcoming';

    return (
      <>
        {showMarker && (
          <span className={getProgressBarsMarkerClasses(layout, status)}>
            {step.iconTpl ? (
              step.iconTpl
            ) : isCircle && step.status === 'complete' ? (
              <svg
                className={PROGRESS_BARS_CHECK_ICON}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : isCircle ? (
              <span className={PROGRESS_BARS_INDEX}>
                {step.index ?? idx + 1}
              </span>
            ) : null}
          </span>
        )}
        {(step.name || step.description) && (
          <span className="smart:flex smart:flex-col">
            {step.name && (
              <span className={getProgressBarsNameClasses(status)}>
                {step.name}
              </span>
            )}
            {step.description && (
              <span className={PROGRESS_BARS_DESCRIPTION}>
                {step.description}
              </span>
            )}
          </span>
        )}
      </>
    );
  };

  return (
    <nav className={cn(PROGRESS_BARS_NAV, className)} aria-label={ariaLabel}>
      {title && <p className={PROGRESS_BARS_STEPPER_TITLE}>{title}</p>}
      <ol role="list" className={getProgressBarsListClasses(layout)}>
        {steps.map((step, idx) => {
          const status: SmartProgressStepStatus = step.status ?? 'upcoming';
          const ariaCurrent = step.status === 'current' ? 'step' : undefined;

          return (
            <Fragment key={step.id}>
              <li className={getProgressBarsStepClasses(layout, status)}>
                {step.href ? (
                  <SmartNavLink
                    href={step.href}
                    className={PROGRESS_BARS_STEP_LINK}
                    aria-current={ariaCurrent}
                  >
                    {renderStepBody(step, idx)}
                  </SmartNavLink>
                ) : (
                  <button
                    type="button"
                    className={PROGRESS_BARS_STEP_BUTTON}
                    aria-current={ariaCurrent}
                    onClick={() => onStepClick?.({ stepId: step.id })}
                  >
                    {renderStepBody(step, idx)}
                  </button>
                )}
              </li>
              {hasConnectors && idx < steps.length - 1 && (
                <li
                  aria-hidden="true"
                  className={getProgressBarsConnectorClasses(status)}
                ></li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
