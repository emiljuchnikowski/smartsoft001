// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import {
  IMediaObjectOptions,
  MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN,
  MediaObjectBaseComponent,
  MediaObjectComponent,
} from '@smartsoft001/angular';

/**
 * A custom media object built on `MediaObjectBaseComponent`.
 *
 * The base contributes the `mediaUrl`, `mediaAlt`, `options` and `class`
 * inputs; the implementation owns the markup around them and projects the
 * body that `<smart-media-object>` receives.
 */
@Component({
  selector: 'docs-custom-media-object',
  template: `
    <article
      [class]="containerClasses()"
      [attr.data-alignment]="options()?.alignment ?? 'top'"
      [attr.data-position]="options()?.position ?? 'left'"
    >
      <img
        class="docs-media-object__media"
        [src]="mediaUrl()"
        [alt]="mediaAlt()"
        width="64"
        height="64"
      />

      <!-- The content of <smart-media-object> is projected here. -->
      <div class="docs-media-object__body">
        <ng-content />
      </div>
    </article>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMediaObjectComponent extends MediaObjectBaseComponent {
  containerClasses = computed(() =>
    [
      'docs-media-object',
      this.options()?.wide ? 'docs-media-object--wide' : '',
      this.options()?.nested ? 'docs-media-object--nested' : '',
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

/**
 * Registering the implementation against
 * `MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN` makes every `<smart-media-object>`
 * in this injector render it instead of the standard variation.
 */
@Component({
  selector: 'docs-media-object-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaObjectComponent],
  providers: [
    {
      provide: MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN,
      useValue: CustomMediaObjectComponent,
    },
  ],
  template: `
    <smart-media-object
      [mediaUrl]="mediaUrl"
      mediaAlt="Portrait of Lindsay Walton"
      [options]="options"
      class="docs-media-object--demo"
    >
      <h3 class="docs-media-object__title">Lindsay Walton</h3>
      <p class="docs-media-object__text">
        Front-end developer, joined the design systems team in March.
      </p>
    </smart-media-object>
  `,
})
export class MediaObjectCustomExampleComponent {
  mediaUrl =
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

  options: IMediaObjectOptions = {
    alignment: 'center',
    position: 'right',
  };
}
// #endregion
