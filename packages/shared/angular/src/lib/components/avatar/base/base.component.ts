import { computed, Directive, input, InputSignal } from '@angular/core';

import {
  DynamicComponentType,
  IAvatarItem,
  IAvatarOptions,
  SmartAvatarShape,
  SmartAvatarSize,
} from '../../../models';

@Directive()
export abstract class AvatarBaseComponent {
  static smartType: DynamicComponentType = 'avatar';

  imageUrl: InputSignal<string | undefined> = input<string>();
  initials: InputSignal<string | undefined> = input<string>();
  size: InputSignal<SmartAvatarSize> = input<SmartAvatarSize>('md');
  shape: InputSignal<SmartAvatarShape> = input<SmartAvatarShape>('circle');
  notificationPosition: InputSignal<'top' | 'bottom' | undefined> = input<
    'top' | 'bottom'
  >();
  group: InputSignal<IAvatarItem[] | undefined> = input<IAvatarItem[]>();
  options: InputSignal<IAvatarOptions | undefined> = input<IAvatarOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  isGroup = computed(() => !!this.group()?.length);
}
