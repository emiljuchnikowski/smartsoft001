import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import { IconName } from '../base/base.component';
import { IconComponent } from '../icon.component';
import {
  getIconContainerClasses,
  getIconSizeClasses,
  IconPresetSize,
  IconPresetVariant,
} from './preset-classes.util';

/**
 * Styled icon variation (preset).
 *
 * Composes `<smart-icon>` inside a themed container. Unlike the token-driven
 * component groups there is no `*_STANDARD_COMPONENT_TOKEN` for the icon, so this
 * preset is used directly through its `<smart-icon-preset>` selector.
 *
 * Renders any `IconName` (or a `template` override) across a `plain`/`contained`/
 * `soft` variant scale in `sm`/`md`/`lg` sizes.
 */
@Component({
  selector: 'smart-icon-preset',
  template: `
    <span [class]="containerClasses()" data-role="icon-preset">
      <smart-icon
        [name]="name()"
        [template]="template()"
        [class]="iconClasses()"
      />
    </span>
  `,
  imports: [IconComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPresetComponent {
  name = input<IconName>('spinner');
  template = input<TemplateRef<unknown> | null>(null);
  variant = input<IconPresetVariant>('plain');
  size = input<IconPresetSize>('md');
  cssClass = input<string>('', { alias: 'class' });

  protected iconClasses = computed(() => getIconSizeClasses(this.size()));

  protected containerClasses = computed(() =>
    [getIconContainerClasses(this.variant(), this.size()), this.cssClass()]
      .filter(Boolean)
      .join(' '),
  );
}
