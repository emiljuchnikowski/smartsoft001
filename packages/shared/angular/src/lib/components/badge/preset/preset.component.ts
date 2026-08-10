import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { BadgeBaseComponent } from '../base';
import {
  getBadgeClasses,
  getDotClasses,
  getRemoveClasses,
  SmartBadgePresetVariant,
} from './preset-classes.util';

/**
 * Styled badge variation (preset).
 *
 * Drop-in replacement for `BadgeStandardComponent` — register it through
 * `BADGE_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-badge>`, or use the
 * `<smart-badge-preset>` selector directly.
 *
 * Groups the solid / soft / outline color presets into a single component,
 * selected via `options.variant` (defaults to `soft`), across the shared
 * `SmartBadgeColor` palette.
 */
@Component({
  selector: 'smart-badge-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgePresetComponent extends BadgeBaseComponent {
  // NgComponentOutlet (used by BadgeComponent when this is registered through
  // BADGE_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected variant = computed<SmartBadgePresetVariant>(
    () => this.options()?.variant ?? 'soft',
  );

  protected pill = computed<boolean>(() => this.options()?.pill !== false);

  protected withDot = computed(() => Boolean(this.options()?.withDot));
  protected withRemove = computed(() => Boolean(this.options()?.withRemove));

  protected badgeClasses = computed(() =>
    getBadgeClasses(this.variant(), this.color(), this.pill(), this.size()),
  );
  protected dotClasses = computed(() => getDotClasses(this.color()));
  protected removeClasses = computed(() => getRemoveClasses());
}
