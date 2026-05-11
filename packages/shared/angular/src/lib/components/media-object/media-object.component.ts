import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { MediaObjectStandardComponent } from './standard/standard.component';
import { IMediaObjectOptions } from '../../models';
import { MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-media-object',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-media-object-standard
        [mediaUrl]="mediaUrl()"
        [mediaAlt]="mediaAlt()"
        [options]="options()"
        [class]="cssClass()"
      >
        <ng-content />
      </smart-media-object-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [MediaObjectStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaObjectComponent {
  private injectedComponent = inject(MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  mediaUrl = input.required<string>();
  mediaAlt = input.required<string>();
  options = input<IMediaObjectOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    mediaUrl: this.mediaUrl(),
    mediaAlt: this.mediaAlt(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
