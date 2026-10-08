import { IEntity } from '@smartsoft001/domain-core';

import * as CrudActions from './crud.actions';
import { CrudAction } from './crud.actions';
import { getCrudFilter } from './crud.selectors';
import { CrudStore } from './crud.store';
import { CrudService } from '../services/crud/crud.service';

/**
 * The side effects of the CRUD actions, ported from the Angular
 * `CrudEffects`: each request action calls the service and dispatches its
 * success or failure; a successful write reloads the list from the first page
 * (and re-selects the updated item).
 *
 * Unlike the Angular effects, which warned about every action they did not
 * handle (including other entities' actions), unhandled actions are ignored.
 */
export class CrudEffects<T extends IEntity<string>> {
  /** Public so a feature can switch to a new service, e.g. a new `apiUrl`. */
  constructor(public service: CrudService<T>) {}

  /** Starts handling the actions of `store`; returns the unsubscribe. */
  init(store: CrudStore): () => void {
    return store.onAction((action) => this.handle(action, store));
  }

  private handle(action: CrudAction, store: CrudStore): void {
    const entity = store.entity;
    const dispatch = (next: CrudAction) => store.dispatch(next);

    switch (action.type) {
      case `[${entity}] Create`:
        this.service
          .create(action['item'])
          .then(() =>
            dispatch(CrudActions.createSuccess(entity, action['item'])),
          )
          .catch((error) =>
            dispatch(CrudActions.createFailure(entity, action['item'], error)),
          );
        break;

      case `[${entity}] Create Success`:
      case `[${entity}] Create Many Success`: {
        const filter = getCrudFilter(store.get());

        dispatch(
          CrudActions.read(
            entity,
            filter ? { ...filter, offset: 0 } : undefined,
          ),
        );
        break;
      }

      case `[${entity}] Create Many`:
        this.service
          .createMany(action['data'].items, action['data'].options)
          .then(() =>
            dispatch(
              CrudActions.createManySuccess(entity, {
                items: action['data'].items,
                options: action['data'].options,
              }),
            ),
          )
          .catch((error) =>
            dispatch(
              CrudActions.createManyFailure(
                entity,
                {
                  items: action['data'].items,
                  options: action['data'].options,
                },
                error,
              ),
            ),
          );
        break;

      case `[${entity}] Read`:
        this.service
          .getList<T>(action['filter'])
          .then((result) =>
            dispatch(CrudActions.readSuccess(entity, action['filter'], result)),
          )
          .catch((error) =>
            dispatch(CrudActions.readFailure(entity, action['filter'], error)),
          );
        break;

      case `[${entity}] Export`:
        this.service
          .exportList(action['filter'], action['format'])
          .then(() =>
            dispatch(CrudActions.exportListSuccess(entity, action['filter'])),
          )
          .catch((error) =>
            dispatch(
              CrudActions.exportListFailure(entity, action['filter'], error),
            ),
          );
        break;

      case `[${entity}] Select`:
        this.service
          .getById(action['id'])
          .then((result) =>
            dispatch(CrudActions.selectSuccess(entity, action['id'], result)),
          )
          .catch((error) =>
            dispatch(CrudActions.selectFailure(entity, action['id'], error)),
          );
        break;

      // The Angular effects sent a full update as a PATCH too; kept as is,
      // since the NestJS shell treats both the same way.
      case `[${entity}] Update`:
        this.service
          .updatePartial(action['item'])
          .then(() =>
            dispatch(CrudActions.updateSuccess(entity, action['item'])),
          )
          .catch((error) => {
            dispatch(CrudActions.updateFailure(entity, action['item'], error));
            dispatch(CrudActions.read(entity));
          });
        break;

      case `[${entity}] Update partial`:
        this.service
          .updatePartial(action['item'])
          .then(() =>
            dispatch(CrudActions.updatePartialSuccess(entity, action['item'])),
          )
          .catch((error) => {
            dispatch(
              CrudActions.updatePartialFailure(entity, action['item'], error),
            );
            dispatch(CrudActions.read(entity));
          });
        break;

      case `[${entity}] Update Success`:
      case `[${entity}] Update partial Success`:
        dispatch(
          CrudActions.read(entity, {
            ...getCrudFilter(store.get()),
            offset: 0,
          }),
        );
        dispatch(CrudActions.select(entity, action['item'].id));
        break;

      case `[${entity}] Update partial many`:
        this.service
          .updatePartialMany(action['items'])
          .then(() =>
            dispatch(
              CrudActions.updatePartialManySuccess(entity, action['items']),
            ),
          )
          .catch((error) => {
            dispatch(
              CrudActions.updatePartialManyFailure(
                entity,
                action['items'],
                error,
              ),
            );
            dispatch(CrudActions.read(entity));
          });
        break;

      case `[${entity}] Update partial many Success`:
      case `[${entity}] Delete Success`:
        dispatch(
          CrudActions.read(entity, {
            ...getCrudFilter(store.get()),
            offset: 0,
          }),
        );
        break;

      case `[${entity}] Delete`:
        this.service
          .delete(action['id'])
          .then(() => dispatch(CrudActions.deleteSuccess(entity, action['id'])))
          .catch((error) =>
            dispatch(CrudActions.deleteFailure(entity, action['id'], error)),
          );
        break;

      default:
        break;
    }
  }
}
