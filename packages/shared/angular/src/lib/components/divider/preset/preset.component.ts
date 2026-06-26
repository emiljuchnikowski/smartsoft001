import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { DividerBaseComponent } from '../base';
import {
  getActionClasses,
  getContainerClasses,
  getIconClasses,
  getPlainClasses,
  getToolbarClasses,
  getToolbarLineClasses,
  SmartDividerPresetPosition,
  SmartDividerPresetVariant,
} from './preset-classes.util';

type ResolvedVariant = SmartDividerPresetVariant | 'plain';

/**
 * Styled divider variation (preset).
 *
 * Drop-in replacement for `DividerStandardComponent` — register it through
 * `DIVIDER_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-divider>`, or use
 * the `<smart-divider-preset>` selector directly.
 *
 * Translates Preline's divider patterns to `smart:`-prefixed Tailwind:
 * a plain `<hr>`, an inline label/icon/title with connecting line(s) positioned
 * left/center/right (via `options.position`), a centered action button, and a
 * label + line + action "toolbar" row. The variant is taken from
 * `options.variant`; when omitted it is inferred from the provided inputs.
 */
@Component({
  selector: 'smart-divider-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerPresetComponent extends DividerBaseComponent {
  // NgComponentOutlet (used by DividerComponent when this is registered through
  // DIVIDER_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected variant = computed<ResolvedVariant>(() => {
    const explicit = this.options()?.variant;
    if (explicit) {
      return explicit;
    }
    if (this.actionLabel()) {
      return 'with-button';
    }
    if (this.title()) {
      return 'with-title';
    }
    if (this.iconName()) {
      return 'with-icon';
    }
    if (this.label()) {
      return 'with-label';
    }
    return 'plain';
  });

  protected position = computed<SmartDividerPresetPosition>(
    () => this.options()?.position ?? 'center',
  );

  protected isPlain = computed(() => this.variant() === 'plain');
  protected isButton = computed(() => this.variant() === 'with-button');
  protected isToolbar = computed(() => this.variant() === 'with-toolbar');

  // Text rendered as the divider content (label/icon/button branches).
  protected content = computed(() => {
    if (this.variant() === 'with-title') {
      return this.title() ?? this.label() ?? '';
    }
    return this.label() ?? this.title() ?? '';
  });

  protected containerClasses = computed(() => {
    const variant = this.variant();
    return getContainerClasses(
      variant === 'plain' ? 'with-label' : variant,
      this.position(),
    );
  });
  protected plainClasses = computed(() => getPlainClasses());
  protected iconClasses = computed(() => getIconClasses());
  protected actionClasses = computed(() => getActionClasses());
  protected toolbarClasses = computed(() => getToolbarClasses());
  protected toolbarLineClasses = computed(() => getToolbarLineClasses());
}
