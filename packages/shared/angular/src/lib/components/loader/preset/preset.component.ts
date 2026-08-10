import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { LoaderBaseComponent } from '../base';
import { getLoaderSpinnerClasses } from './preset-classes.util';

/**
 * Styled loader variation (preset).
 *
 * Drop-in replacement for `LoaderStandardComponent` — register it through
 * `LOADER_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-loader>`, or use
 * the `<smart-loader-preset>` selector directly.
 *
 * Renders the canonical Preline "default" spinner: a self-spinning bordered
 * ring (`border-current` arc with a transparent top border) sized via `size`
 * and colored via `color`, across the shared `SmartColor` palette with explicit
 * `dark:` variants.
 */
@Component({
  selector: 'smart-loader-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderPresetComponent extends LoaderBaseComponent {
  // NgComponentOutlet (used by LoaderComponent when this is registered through
  // LOADER_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected spinnerClass = computed(() =>
    [getLoaderSpinnerClasses(this.size(), this.color()), this.cssClass()]
      .filter(Boolean)
      .join(' '),
  );
}
