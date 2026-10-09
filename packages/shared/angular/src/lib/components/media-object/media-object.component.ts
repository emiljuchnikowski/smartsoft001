import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { MediaObjectStandardComponent } from './standard/standard.component';
import { IMediaObjectOptions } from '../../models';
import { MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { outletContent } from '../base/outlet-content';

@Component({
  selector: 'smart-media-object',
  template: `
    <ng-template #content><ng-content /></ng-template>
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="
          componentType();
          inputs: componentInputs();
          content: projectedContent()
        "
      />
    } @else {
      <smart-media-object-standard
        [mediaUrl]="mediaUrl()"
        [mediaAlt]="mediaAlt()"
        [options]="options()"
        [class]="cssClass()"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </smart-media-object-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [MediaObjectStandardComponent, NgComponentOutlet, NgTemplateOutlet],
  host: { class: 'smart:contents' },
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

  /** The wrapper's `<ng-content>`, captured once for whichever branch renders. */
  private readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>('content');

  /** The captured content for an implementation registered through the token. */
  protected readonly projectedContent = outletContent(this.contentTemplate);
}
