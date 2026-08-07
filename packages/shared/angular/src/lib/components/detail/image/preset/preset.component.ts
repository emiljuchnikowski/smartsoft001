import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { DetailImageComponent } from '../image.component';

@Component({
  selector: 'smart-detail-image-preset',
  template: `
    @let url = imageUrl();
    @if (url) {
      <img data-role="image" [class]="imageClasses()" [src]="url" alt="" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailImagePresetComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailImageComponent<T> {
  override imageClasses = computed(() => {
    const classes = [
      'smart:size-[150px]',
      'smart:rounded-xl',
      'smart:object-cover',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:shadow-2xs',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
