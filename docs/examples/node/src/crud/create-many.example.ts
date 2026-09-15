// #region usage
import { CreateManyMode, ICreateManyOptions } from '@smartsoft001/crud-domain';
import { CrudService } from '@smartsoft001/crud-shell-app-services';
import { IUser } from '@smartsoft001/users';

import { Note } from './crud-service.example';

/**
 * Bulk insert. `mode: 'replace'` empties the collection before the insert, so
 * the imported batch becomes the whole content. `mode: 'default'` appends to
 * whatever is already stored.
 *
 * Every note is validated and its password hashed, exactly as in `create`, and
 * the returned array carries the generated ids.
 */
export function importNotes(
  service: CrudService<Note>,
  notes: Note[],
  user: IUser,
  mode: CreateManyMode,
): Promise<Note[]> {
  const options: ICreateManyOptions = { mode };

  return service.createMany(notes, user, options);
}
// #endregion
