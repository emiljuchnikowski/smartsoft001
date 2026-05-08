import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, IMediaObjectOptions } from '../../../models';

@Directive()
export abstract class MediaObjectBaseComponent {
  static smartType: DynamicComponentType = 'media-object';

  mediaUrl: InputSignal<string> = input.required<string>();
  mediaAlt: InputSignal<string> = input.required<string>();
  options: InputSignal<IMediaObjectOptions | undefined> =
    input<IMediaObjectOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
