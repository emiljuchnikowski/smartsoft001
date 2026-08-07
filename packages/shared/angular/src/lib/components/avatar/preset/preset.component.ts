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
  getAvatarGroupContainerClasses,
  getAvatarGroupItemImageClasses,
  getAvatarGroupItemInitialsClasses,
  getAvatarIconWrapperClasses,
  getAvatarImageClasses,
  getAvatarInitialsClasses,
  getAvatarStatusClasses,
  AVATAR_STATUS_WRAPPER,
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
    getAvatarImageClasses(this.size(), this.shape()),
  );
  protected initialsClasses = computed(() =>
    getAvatarInitialsClasses(this.size(), this.shape()),
  );
  protected iconWrapperClasses = computed(() =>
    getAvatarIconWrapperClasses(this.size(), this.shape()),
  );

  protected statusWrapper = AVATAR_STATUS_WRAPPER;
  protected statusClasses = computed(() =>
    getAvatarStatusClasses(this.size(), this.notificationPosition() ?? 'top'),
  );

  protected groupContainerClasses = computed(() =>
    getAvatarGroupContainerClasses(this.options()?.stackDirection),
  );
  protected groupItemImageClasses = computed(() =>
    getAvatarGroupItemImageClasses(this.size(), this.shape()),
  );
  protected groupItemInitialsClasses = computed(() =>
    getAvatarGroupItemInitialsClasses(this.size(), this.shape()),
  );
}
