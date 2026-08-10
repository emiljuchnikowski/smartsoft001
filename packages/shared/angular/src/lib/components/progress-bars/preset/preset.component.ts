import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  SmartProgressBarsLayout,
  SmartProgressStepStatus,
} from '../../../models';
import { ProgressBarsBaseComponent } from '../base';
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
} from './preset-classes.util';

/**
 * Styled progress-bars variation (preset).
 *
 * Drop-in replacement for `ProgressBarsStandardComponent` — register it through
 * `PROGRESS_BARS_STANDARD_COMPONENT_TOKEN` to restyle every
 * `<smart-progress-bars>`, or use the `<smart-progress-bars-preset>` selector
 * directly.
 *
 * Renders two modes off the shared `IProgressBarsOptions` API:
 * - the percentage `progress-bar` layout (track + fill, optional title/value
 *   label and column captions), and
 * - the step-list / stepper layouts (`simple`, `panels`, `panels-with-border`,
 *   `bullets`, `bullets-and-text`, `circles`, `circles-with-text`).
 */
@Component({
  selector: 'smart-progress-bars-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class ProgressBarsPresetComponent extends ProgressBarsBaseComponent {
  // NgComponentOutlet (used by ProgressBarsComponent when this is registered
  // through PROGRESS_BARS_STANDARD_COMPONENT_TOKEN) passes inputs by canonical
  // name, so the inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected layout = computed<SmartProgressBarsLayout>(
    () => this.options()?.layout ?? 'simple',
  );

  protected isBarLayout = computed(() => this.layout() === 'progress-bar');

  protected steps = computed(() => this.options()?.steps ?? []);
  protected columns = computed(() => this.options()?.columns ?? []);
  protected title = computed(() => this.options()?.title);
  protected srOnlyTitle = computed(() => this.options()?.srOnlyTitle);
  protected ariaLabel = computed(() => this.options()?.ariaLabel ?? 'Progress');

  protected clampedValue = computed(() => {
    const v = this.options()?.value ?? 0;
    return Math.max(0, Math.min(100, v));
  });

  protected isVertical = computed(() => isProgressBarsVertical(this.layout()));
  protected isSimple = computed(() => isProgressBarsSimple(this.layout()));
  protected isPanel = computed(() => isProgressBarsPanel(this.layout()));
  protected isBullet = computed(() => isProgressBarsBullet(this.layout()));
  protected isCircle = computed(() => isProgressBarsCircle(this.layout()));

  // Connectors only make sense for horizontal circle/bullet rows.
  protected hasConnectors = computed(
    () =>
      !this.isVertical() &&
      !this.isSimple() &&
      !this.isPanel() &&
      (this.isCircle() || this.isBullet()),
  );

  protected showMarker = computed(() => !this.isSimple());

  // Static class bundles surfaced to the template.
  protected wrapperClasses = PROGRESS_BARS_WRAPPER;
  protected headerClasses = PROGRESS_BARS_HEADER;
  protected barTitleClasses = PROGRESS_BARS_TITLE;
  protected valueLabelClasses = PROGRESS_BARS_VALUE_LABEL;
  protected trackClasses = PROGRESS_BARS_TRACK;
  protected fillClasses = PROGRESS_BARS_FILL;
  protected columnsClasses = PROGRESS_BARS_COLUMNS;
  protected navClasses = PROGRESS_BARS_NAV;
  protected stepperTitleClasses = PROGRESS_BARS_STEPPER_TITLE;
  protected descriptionClasses = PROGRESS_BARS_DESCRIPTION;
  protected indexClasses = PROGRESS_BARS_INDEX;
  protected stepButtonClasses = PROGRESS_BARS_STEP_BUTTON;
  protected stepLinkClasses = PROGRESS_BARS_STEP_LINK;
  protected checkIconClasses = PROGRESS_BARS_CHECK_ICON;

  protected listClasses = computed(() =>
    getProgressBarsListClasses(this.layout()),
  );

  protected columnsStyle = computed(
    () => `repeat(${this.columns().length || 1}, minmax(0, 1fr))`,
  );

  protected stepClasses(status: SmartProgressStepStatus | undefined): string {
    return getProgressBarsStepClasses(this.layout(), status ?? 'upcoming');
  }

  protected markerClasses(status: SmartProgressStepStatus | undefined): string {
    return getProgressBarsMarkerClasses(this.layout(), status ?? 'upcoming');
  }

  protected nameClasses(status: SmartProgressStepStatus | undefined): string {
    return getProgressBarsNameClasses(status ?? 'upcoming');
  }

  protected connectorClasses(
    status: SmartProgressStepStatus | undefined,
  ): string {
    return getProgressBarsConnectorClasses(status ?? 'upcoming');
  }

  protected columnClasses(active: boolean | undefined): string {
    return getProgressBarsColumnClasses(Boolean(active));
  }

  protected onStepClick(stepId: string): void {
    this.stepClick.emit({ stepId });
  }
}
