import { SmartPageProps } from './page.types';
import { SmartPageStandard } from './standard/page-standard';
import { IPageOptions, SmartPageVariant } from '../../models';
import { useSmartComponent } from '../../providers/hooks';
import { SmartComponentKey } from '../../providers/smart-context';

/**
 * The `SmartProvider` `components` key a page variant is registered under:
 * `'page'` for `'standard'` (the page's `DynamicComponentType`),
 * `'page:<variant>'` for the others, e.g. `'page:preset'`.
 */
export function getPageVariantKey(
  variant: SmartPageVariant,
): SmartComponentKey {
  return variant === 'standard' ? 'page' : 'page:' + variant;
}

/**
 * Renders the component registered for `options.variant` (`'standard'` when
 * omitted) under `getPageVariantKey(variant)` on `SmartProvider`,
 * `SmartPageStandard` when nothing is registered for it. `children` become the
 * body when `options.bodyTpl` is not set.
 */
export function SmartPage({
  options,
  className = '',
  children,
}: SmartPageProps) {
  const variant = options?.variant ?? 'standard';
  const Component = useSmartComponent(
    getPageVariantKey(variant),
    SmartPageStandard,
  );

  const opts: IPageOptions = options ?? { title: '' };
  const mergedOptions: IPageOptions = {
    ...opts,
    bodyTpl: opts.bodyTpl ?? children,
  };

  return <Component options={mergedOptions} className={className} />;
}
