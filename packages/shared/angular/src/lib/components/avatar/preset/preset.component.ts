import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { AvatarBaseComponent } from '../base';
import {
  getGroupContainerClasses,
  getGroupItemImageClasses,
  getGroupItemInitialsClasses,
  getIconWrapperClasses,
  getImageClasses,
  getInitialsClasses,
  getStatusClasses,
  STATUS_WRAPPER,
} from './preset-classes.util';

type AvatarMode = 'image' | 'initials' | 'icon';

/**
 * Styled avatar variation (preset).
 *
 * Drop-in replacement for `AvatarStandardComponent` — register it through
 * `AVATAR_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-avatar>`, or use
 * the `<smart-avatar-preset>` selector directly.
 *
 * Renders an image, initials or icon placeholder across the `SmartAvatarSize`
 * scale in `circle`/`rounded` shapes, with an optional corner status dot and a
 * stacked group layout (`group` + `options.stackDirection`).
 */
@Component({
  selector: 'smart-avatar-preset',
  templateUrl: './preset.component.html',
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPresetComponent extends AvatarBaseComponent {
  // NgComponentOutlet (used by AvatarComponent when this is registered through
  // AVATAR_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected mode = computed<AvatarMode>(() => {
    if (this.imageUrl()) {
      return 'image';
    }
    if (this.initials() || this.options()?.placeholderType === 'initials') {
      return 'initials';
    }
    return 'icon';
  });

  protected imageClasses = computed(() =>
    getImageClasses(this.size(), this.shape()),
  );
  protected initialsClasses = computed(() =>
    getInitialsClasses(this.size(), this.shape()),
  );
  protected iconWrapperClasses = computed(() =>
    getIconWrapperClasses(this.size(), this.shape()),
  );

  protected statusWrapper = STATUS_WRAPPER;
  protected statusClasses = computed(() =>
    getStatusClasses(this.size(), this.notificationPosition() ?? 'top'),
  );

  protected groupContainerClasses = computed(() =>
    getGroupContainerClasses(this.options()?.stackDirection),
  );
  protected groupItemImageClasses = computed(() =>
    getGroupItemImageClasses(this.size(), this.shape()),
  );
  protected groupItemInitialsClasses = computed(() =>
    getGroupItemInitialsClasses(this.size(), this.shape()),
  );
}
