import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';

import { DetailVideoComponent } from '../video.component';

@Component({
  selector: 'smart-detail-video-preset',
  template: `
    @let item = options()?.item?.();
    @if (item && options()?.key) {
      <video
        data-role="video"
        [class]="videoClasses()"
        controls
        controlsList="nodownload"
      >
        <source type="video/mp4" [src]="getUrl(item)" />
        Your browser does not support the video tag.
      </video>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailVideoPresetComponent<
  T extends IEntity<string> | undefined,
> extends DetailVideoComponent<T> {
  override videoClasses = computed(() => {
    const classes = [
      'smart:w-full',
      'smart:rounded-xl',
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
