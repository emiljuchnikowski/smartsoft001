import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { IStatItem } from '../../../models';
import { StatsBaseComponent } from '../base';
import {
  getStatsActionClasses,
  getStatsChangeClasses,
  getStatsContainerClasses,
  getStatsGridClasses,
  getStatsIconWrapClasses,
  getStatsLabelClasses,
  getStatsSubClasses,
  getStatsTitleClasses,
  getStatsValueClasses,
  SmartStatsColumns,
} from './preset-classes.util';

/**
 * Styled stats variation (preset).
 *
 * Drop-in replacement for `StatsStandardComponent` — register it through
 * `STATS_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-stats>`, or use the
 * `<smart-stats-preset>` selector directly.
 *
 * Renders a responsive grid of stat blocks (Preline "Three-Column Stats with
 * Primary Accent" look): an optional leading icon, a `label` heading, the big
 * primary `value` with an optional inline `change` badge coloured by `trend`,
 * and an optional muted `previousValue` sub-line. Column count comes from
 * `options.columns` (default 3).
 */
@Component({
  selector: 'smart-stats-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class StatsPresetComponent extends StatsBaseComponent {
  // NgComponentOutlet (used by StatsComponent when this is registered through
  // STATS_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected title = computed(() => this.options()?.title);
  protected items = computed<IStatItem[]>(() => this.options()?.items ?? []);
  protected columns = computed<SmartStatsColumns>(
    () => this.options()?.columns ?? 3,
  );

  protected containerClasses = computed(() => getStatsContainerClasses());
  protected gridClasses = computed(() => getStatsGridClasses(this.columns()));
  protected titleClasses = computed(() => getStatsTitleClasses());
  protected labelClasses = computed(() => getStatsLabelClasses());
  protected valueClasses = computed(() => getStatsValueClasses());
  protected subClasses = computed(() => getStatsSubClasses());
  protected iconWrapClasses = computed(() => getStatsIconWrapClasses());
  protected actionClasses = computed(() => getStatsActionClasses());

  protected changeClasses(trend: IStatItem['trend']): string {
    return getStatsChangeClasses(trend);
  }
}
