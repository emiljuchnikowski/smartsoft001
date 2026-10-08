import { useEffect, useRef } from 'react';

import { IEntity } from '@smartsoft001/domain-core';

import { SmartDetails } from '../../components/details/details';
import { IDetailsOptions } from '../../models';
import { useStyleService } from '../../providers/hooks';

export interface SmartDetailsPageProps<T extends IEntity<string> = any> {
  /**
   * The details to show. `useDetailsModal` passes its `params` here, as the
   * Angular `DetailsDirective` passed them to the modal as `value`.
   */
  value?: IDetailsOptions<T>;
}

/**
 * The Angular `DetailsPage`: the details of `value`, full width, with the
 * application style (`StyleService`) applied to its element. Open it in a
 * modal with `useDetailsModal({ component: SmartDetailsPage, params })`;
 * `useDetailsPageOptions(value)` gives the title and buttons for a page
 * layout around it.
 */
export function SmartDetailsPage<T extends IEntity<string>>({
  value,
}: SmartDetailsPageProps<T>) {
  const styleService = useStyleService();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    styleService.init(ref.current);
  }, [styleService]);

  return (
    <div ref={ref} className="smart:w-full">
      <SmartDetails options={value ?? ({} as IDetailsOptions<T>)} />
    </div>
  );
}
