// #region usage
import { SharedConfig } from '@smartsoft001/nestjs';

type ChangePolicy = NonNullable<SharedConfig['changePolicy']>;

/**
 * Lets a user follow the changes of a note they own. The gateway calls the
 * policy once when the client subscribes, without `type`, and again before
 * every event with the change `type`.
 *
 * A `'delete'` event arrives after the document is gone, so looking the owner
 * up would deny it and the client would never learn about the delete. The
 * subscription was already checked when it opened, so the delete is allowed
 * without a lookup.
 */
export function createChangePolicy(
  findOwner: (id: string) => Promise<string | undefined>,
): ChangePolicy {
  return async ({ id, user, type }) => {
    if (type === 'delete') return true;

    return (await findOwner(id)) === user.username;
  };
}
// #endregion
