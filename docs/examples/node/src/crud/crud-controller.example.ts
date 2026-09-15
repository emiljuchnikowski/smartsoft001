// #region usage
import { Response } from 'express';

import { CrudController } from '@smartsoft001/crud-shell-nestjs';
import { IUser } from '@smartsoft001/users';

import { Note } from './crud-service.example';

/**
 * What `POST /` of the CRUD controller does. The route is registered by
 * `CrudShellNestjsModule.forRoot({ restApi: true })` and guarded by
 * `AuthJwtGuard`, so `user` comes from the JWT.
 *
 * Nest hands the handler the raw response, which is why the controller writes
 * the header itself: `CrudController.getLink(res.req)` rebuilds the request
 * URL from the protocol, the Host header and the path, and the new id is
 * appended to it. The body is `{ id }` with status 200.
 */
export async function postNote(
  controller: CrudController<Note>,
  note: Note,
  user: IUser,
  res: Response,
): Promise<string | undefined> {
  await controller.create(note, user, res);

  return res.get('Location');
}
// #endregion
