import { Type } from '@angular/core';

import { ListMode } from '../../models';
import { ListBaseComponent } from './base/base.component';
import { ListDesktopPresetComponent } from './desktop/preset/preset.component';
import { ListMobilePresetComponent } from './mobile/preset/preset.component';

/**
 * Preline-styled list mode presets (FRA-227), keyed by `ListMode`.
 * Provide it for `LIST_MODE_COMPONENTS_TOKEN` to swap the covered modes:
 *
 * ```ts
 * providers: [
 *   { provide: LIST_MODE_COMPONENTS_TOKEN, useValue: LIST_PRESET_MODE_COMPONENTS },
 * ];
 * ```
 *
 * The map is partial on purpose — only `desktop` (Preline table, styling
 * driven by `IListOptions.presentation`) and `mobile` (card grid) ship a
 * preset; `masonryGrid` keeps the standard component via the `baseMap`
 * merge in `ListComponent`.
 */
export const LIST_PRESET_MODE_COMPONENTS: Partial<
  Record<ListMode, Type<ListBaseComponent<any>>>
> = {
  [ListMode.desktop]: ListDesktopPresetComponent,
  [ListMode.mobile]: ListMobilePresetComponent,
};
