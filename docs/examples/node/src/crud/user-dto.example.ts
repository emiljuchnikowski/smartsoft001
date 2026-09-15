// #region usage
import { ItemChangedData, UserDto } from '@smartsoft001/crud-shell-dtos';
import { getInvalidFields } from '@smartsoft001/models';

/**
 * `UserDto` marks `username` and `password` as required, so the same metadata
 * check the CRUD service runs before an insert can be reused on the caller
 * side. It is the `@smartsoft001/models` metadata API, not class-validator.
 */
export function missingCredentials(dto: UserDto): string[] {
  return getInvalidFields(dto, 'create', []);
}

/**
 * Turns one entry of the change feed returned by `CrudService.changes(...)`
 * into a log line. The feed is a discriminated union, so the `type` field
 * narrows the payload: only an update carries `removedFields` and
 * `updatedFields`.
 */
export function toChangeMessage(change: ItemChangedData): string {
  switch (change.type) {
    case 'create':
      return `${change.id} created`;
    case 'update': {
      const changed = Object.keys(change.data.updatedFields).length;
      const removed = change.data.removedFields.length;

      return `${change.id} updated: ${changed} changed, ${removed} removed`;
    }
    case 'delete':
      return `${change.id} deleted`;
    default:
      return 'unknown change';
  }
}
// #endregion
