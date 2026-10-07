// #region usage
import { SharedConfig } from '@smartsoft001/nestjs';

type AttachmentPolicy = NonNullable<SharedConfig['attachmentPolicy']>;

/** Where the application keeps who uploaded which attachment. */
export interface AttachmentOwners {
  set(id: string, username: string): Promise<void>;
  get(id: string): Promise<string | undefined>;
}

/** A stand-in for a real collection, enough for the example and its spec. */
export class InMemoryAttachmentOwners implements AttachmentOwners {
  private readonly owners = new Map<string, string>();

  async set(id: string, username: string): Promise<void> {
    this.owners.set(id, username);
  }

  async get(id: string): Promise<string | undefined> {
    return this.owners.get(id);
  }
}

/**
 * The `create` check receives the id the upload will be stored under, before
 * the body is read, so it is the place to link the file to its uploader.
 *
 * Reads are allowed anonymously for any file uploaded through the route,
 * because the stock Angular UI loads files from plain URLs with no Bearer
 * header. Deletes are kept to the uploader.
 */
export function createAttachmentPolicy(
  owners: AttachmentOwners,
): AttachmentPolicy {
  return async ({ operation, id, user }) => {
    if (operation === 'create') {
      if (!user) return false;
      await owners.set(id, user.username);
      return true;
    }

    const owner = await owners.get(id);
    if (!owner) return false;
    if (operation === 'read') return true;

    return owner === user?.username;
  };
}
// #endregion
