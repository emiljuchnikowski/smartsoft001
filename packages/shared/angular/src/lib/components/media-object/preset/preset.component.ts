import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  getMediaObjectBodyClasses,
  getMediaObjectMediaClasses,
  getMediaObjectRootClasses,
} from './preset-classes.util';
import { MediaObjectStandardComponent } from '../standard/standard.component';

/**
 * Styled media-object variation (preset).
 *
 * Drop-in replacement for `MediaObjectStandardComponent` — register it through
 * `MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-media-object>`,
 * or use the `<smart-media-object-preset>` selector directly.
 *
 * Lays a rounded thumbnail beside projected body content, honouring
 * `IMediaObjectOptions`: `position` (left/right), `alignment`
 * (top/center/bottom/stretched), `responsive` folding, `nested` spacing and a
 * `wide` media footprint.
 */
@Component({
  selector: 'smart-media-object-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaObjectPresetComponent extends MediaObjectStandardComponent {
  // Declared without the inherited `class` alias. <smart-media-object> resolves
  // its inputs to the names this component declares (outletInputs), so the
  // class passed to the wrapper still lands here; used directly, the preset
  // takes the extra classes as `[cssClass]`.
  override cssClass = input<string>('');

  protected rootClasses = computed(() =>
    getMediaObjectRootClasses(this.options()),
  );
  protected mediaClasses = computed(() =>
    getMediaObjectMediaClasses(this.options()),
  );
  protected bodyClasses = getMediaObjectBodyClasses();
}
