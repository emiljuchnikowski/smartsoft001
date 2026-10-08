import type { ComponentType } from 'react';

import { IEntity } from '@smartsoft001/domain-core';

import { SmartListDesktopPreset } from './desktop/preset/list-desktop-preset';
import { SmartListModeProps } from './list.types';
import { ListMode } from '../../models';
import { SmartListMasonryGridPreset } from './masonry-grid/preset/list-masonry-grid-preset';
import { SmartListMobilePreset } from './mobile/preset/list-mobile-preset';

/**
 * Preline-styled list mode presets, keyed by `ListMode`. Register it as
 * `listModeComponents` on `SmartProvider` (the Angular
 * `LIST_MODE_COMPONENTS_TOKEN`) to swap the covered modes:
 *
 * ```tsx
 * <SmartProvider listModeComponents={LIST_PRESET_MODE_COMPONENTS}>
 * ```
 *
 * The map covers every `ListMode`: `desktop` (Preline table, styling driven
 * by `IListOptions.presentation`), `mobile` (card grid) and `masonryGrid`
 * (masonry card columns).
 */
export const LIST_PRESET_MODE_COMPONENTS: Partial<
  Record<ListMode, ComponentType<SmartListModeProps<IEntity<string>>>>
> = {
  [ListMode.desktop]: SmartListDesktopPreset,
  [ListMode.mobile]: SmartListMobilePreset,
  [ListMode.masonryGrid]: SmartListMasonryGridPreset,
};
