import { useCallback, useEffect, useReducer, useRef } from 'react';

import { IEntity } from '@smartsoft001/domain-core';

import { SmartCrudGroupProps } from './group.types';
import { useCrudListGroupService } from '../../crud.context';
import { ICrudListGroup } from '../../models';

/**
 * The behaviour of the list groups (the Angular `GroupBaseComponent`).
 * `change(val, item)` closes the other groups, filters the list by the group
 * through `CrudListGroupService` and sets `item.show` — on the next tick when
 * opening (the list reads first), at once when closing. The groups are
 * plain objects changed in place, as in Angular; the hook re-renders after
 * each change. When the component goes away, the service drops the query
 * items of the groups again.
 */
export function useCrudGroup<T extends IEntity<string>>({
  groups = null,
  listOptions = null,
}: SmartCrudGroupProps<T>) {
  const groupService = useCrudListGroupService<T>();
  // The Angular `cd.detectChanges()`.
  const [, detectChanges] = useReducer((tick: number) => tick + 1, 0);
  const latest = useRef({ groups, groupService });

  useEffect(() => {
    latest.current = { groups, groupService };
  });

  useEffect(
    () => () => {
      const current = latest.current;

      if (current.groups) current.groupService.destroy(current.groups);
    },
    [],
  );

  const change = useCallback(
    (val: boolean, item: ICrudListGroup, force = false): void => {
      if (groups) {
        groups
          .filter((i) => i.value !== item.value || i.key !== item.key)
          .forEach((i) => {
            i.show = false;
          });
      }

      groupService.change(val, item, force);

      if (val) {
        setTimeout(() => {
          item.show = val;
          detectChanges();
        });
      } else {
        item.show = val;
        detectChanges();
      }
    },
    [groups, groupService],
  );

  return { groups, listOptions, change };
}
