import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { InfoBaseComponent } from '../base';
import {
  getInfoContainerClasses,
  getInfoToggleClasses,
  getInfoTooltipClasses,
  InfoPresetPlacement,
} from './preset-classes.util';

let nextInfoTooltipId = 0;

/**
 * Styled info / tooltip variation (preset).
 *
 * Drop-in replacement for `InfoStandardComponent` — register it through
 * `INFO_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-info>`, or use the
 * `<smart-info-preset>` selector directly.
 *
 * Renders the Preline "Tooltip" look: a circular icon toggle with a small
 * tooltip bubble. Visibility is driven by Angular hover/focus + the inherited
 * `isOpen` signal and `@if` (Preline's JS plugin is not installed), keeping the
 * translated Preline visual classes, placement and `role="tooltip"` ARIA.
 */
@Component({
  selector: 'smart-info-preset',
  templateUrl: './preset.component.html',
  imports: [TranslatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPresetComponent extends InfoBaseComponent {
  // Declared without the inherited `class` alias. <smart-info> resolves its
  // inputs to the names this component declares (outletInputs), so the class
  // passed to the wrapper still lands here; used directly, the preset takes the
  // extra classes as `[cssClass]`.
  override cssClass = input<string>('');

  placement = input<InfoPresetPlacement>('top');

  protected readonly tooltipId = `smart-info-tooltip-${nextInfoTooltipId++}`;

  protected containerClasses = computed(() =>
    [getInfoContainerClasses(), this.cssClass()].filter(Boolean).join(' '),
  );
  protected toggleClasses = computed(() => getInfoToggleClasses());
  protected tooltipClasses = computed(() =>
    getInfoTooltipClasses(this.placement()),
  );
}
