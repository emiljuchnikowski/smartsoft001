import { useMemo } from 'react';

import { IEntity } from '@smartsoft001/domain-core';

import {
  IDetailsOptions,
  IIconButtonOptions,
  IPageOptions,
} from '../../models';
import { useModalService } from '../../providers/hooks';

/**
 * The page options the Angular `DetailsPage` prepared for its page layout:
 * the `details` title (or `value.title`) without the menu button, a `trash`
 * button when there is a `removeHandler` and an `arrow-forward-outline`
 * button when there is an `itemHandler`. Both buttons close the modal.
 *
 * The layout itself moved out of the library (FRA-121), so `SmartDetailsPage`
 * does not render these; an application wrapping the page in its own page
 * layout can.
 */
export function useDetailsPageOptions<T extends IEntity<string>>(
  value?: IDetailsOptions<T>,
): IPageOptions {
  const modalService = useModalService();

  return useMemo(() => {
    const buttons: IIconButtonOptions[] = [];

    if (value?.removeHandler) {
      buttons.push({
        handler: () => {
          if (value.item) value.removeHandler?.(value.item);
          void modalService.dismiss();
        },
        icon: 'trash',
      });
    }

    if (value?.itemHandler) {
      buttons.push({
        handler: () => {
          if (value.item) value.itemHandler?.(value.item.id);
          void modalService.dismiss();
        },
        icon: 'arrow-forward-outline',
      });
    }

    return {
      title: value?.title ? value.title : 'details',
      hideMenuButton: true,
      endButtons: buttons,
    };
  }, [value, modalService]);
}
