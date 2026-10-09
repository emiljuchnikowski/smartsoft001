import { useCallback } from 'react';

import { IButtonOptions, IIconButtonOptions } from '../../models';
import { useNavigation } from '../../providers/hooks';

const noop = () => undefined;

/**
 * The page's logic: `back()` goes to the previous location, through the
 * navigation adapter.
 */
export function usePage() {
  const navigation = useNavigation();

  const back = useCallback((): void => {
    navigation.back();
  }, [navigation]);

  return { back };
}

/**
 * The `SmartButton` options of a page end button: a secondary, `md` button
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
