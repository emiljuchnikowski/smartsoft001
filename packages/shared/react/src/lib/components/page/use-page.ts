import { useCallback } from 'react';

import { IButtonOptions, IIconButtonOptions } from '../../models';
import { useNavigation } from '../../providers/hooks';

const noop = () => undefined;

/**
 * The Angular `PageBaseComponent`: `back()` goes to the previous location
 * (the Angular `Location.back()`), through the navigation adapter.
 */
export function usePage() {
  const navigation = useNavigation();

  const back = useCallback((): void => {
    navigation.back();
  }, [navigation]);

  return { back };
}

/**
 * The `SmartButton` options of a page end button (the Angular
 * `PageStandardComponent.getButtonOptions`): a secondary, `md` button
 * running `btn.handler`.
 */
export function getPageButtonOptions(
  btn: Pick<IIconButtonOptions, 'handler'>,
): IButtonOptions {
  return {
    click: btn.handler ?? noop,
    variant: 'secondary',
    size: 'md',
  };
}
