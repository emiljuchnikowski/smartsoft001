import { SmartPagePreset } from './preset/page-preset';
import { SmartComponentOverrides } from '../../providers/smart-context';

/**
 * Styled page variant preset, keyed by `getPageVariantKey(variant)`. Pass it to
 * `SmartProvider` to register the `'preset'` variant alongside the built-in
 * `'standard'`:
 *
 * ```tsx
 * <SmartProvider components={{ ...PAGE_PRESET_VARIANT_COMPONENTS }}>
 * ```
 *
 * It only adds `'preset'`; `'standard'` keeps `SmartPageStandard`.
 */
export const PAGE_PRESET_VARIANT_COMPONENTS: SmartComponentOverrides = {
  'page:preset': SmartPagePreset,
};
