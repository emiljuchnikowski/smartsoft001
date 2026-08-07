import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { DrawerBaseComponent } from '../base';
import {
  getDrawerBackdropClasses,
  getDrawerBodyClasses,
  getDrawerCloseClasses,
  getDrawerHeaderClasses,
  getDrawerPanelClasses,
  getDrawerTitleClasses,
  SmartDrawerPresetPosition,
} from './preset-classes.util';

/**
 * Styled drawer (offcanvas) variation (preset).
 *
 * Drop-in replacement for `DrawerStandardComponent` — register it through
 * `DRAWER_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-drawer>`, or use
 * the `<smart-drawer-preset>` selector directly.
 *
 * Renders the translated Preline offcanvas look: a sliding side panel with a
 * header (title + close button), a body slot and an optional backdrop. Open/close,
 * side placement (`options.position`) and the backdrop (`options.withOverlay`) are
 * Angular-driven via the `open` model + `@if`, so no Preline JS runtime is needed.
 */
@Component({
  selector: 'smart-drawer-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerPresetComponent extends DrawerBaseComponent {
  // NgComponentOutlet (used by DrawerComponent when this is registered through
  // DRAWER_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected position = computed<SmartDrawerPresetPosition>(
    () => this.options()?.position ?? 'right',
  );

  protected wide = computed<boolean>(() => Boolean(this.options()?.wide));
  protected withOverlay = computed<boolean>(() =>
    Boolean(this.options()?.withOverlay),
  );
  protected brandedHeader = computed<boolean>(() =>
    Boolean(this.options()?.brandedHeader),
  );

  protected panelClasses = computed(() =>
    getDrawerPanelClasses(this.position(), this.wide()),
  );
  protected backdropClasses = computed(() => getDrawerBackdropClasses());
  protected headerClasses = computed(() =>
    getDrawerHeaderClasses(this.brandedHeader()),
  );
  protected titleClasses = computed(() =>
    getDrawerTitleClasses(this.brandedHeader()),
  );
  protected closeClasses = computed(() =>
    getDrawerCloseClasses(this.brandedHeader()),
  );
  protected bodyClasses = computed(() => getDrawerBodyClasses());
}
