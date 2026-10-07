import { IUser } from '@smartsoft001/users';

import {
  createAttachmentPolicy,
  InMemoryAttachmentOwners,
} from './attachment-policy.example';

const anna: IUser = { username: 'anna', permissions: ['user'] };
const bob: IUser = { username: 'bob', permissions: ['user'] };

describe('docs-examples-node: attachment policy', () => {
  let owners: InMemoryAttachmentOwners;

  beforeEach(() => {
    owners = new InMemoryAttachmentOwners();
  });

  it('should record the uploader when it allows the create check', async () => {
    const policy = createAttachmentPolicy(owners);

    const allowed = await policy({ operation: 'create', id: 'f1', user: anna });

    expect(allowed).toBe(true);
    expect(await owners.get('f1')).toBe('anna');
  });

  it('should refuse an upload without a user', async () => {
    const policy = createAttachmentPolicy(owners);

    const allowed = await policy({
      operation: 'create',
      id: 'f1',
      user: undefined,
    });

    expect(allowed).toBe(false);
  });

  it('should let only the uploader delete the file', async () => {
    const policy = createAttachmentPolicy(owners);
    await policy({ operation: 'create', id: 'f1', user: anna });

    const byOwner = await policy({ operation: 'delete', id: 'f1', user: anna });
    const byOther = await policy({ operation: 'delete', id: 'f1', user: bob });

    expect(byOwner).toBe(true);
    expect(byOther).toBe(false);
  });

  it('should allow an anonymous read of an uploaded file, as the stock UI needs', async () => {
    const policy = createAttachmentPolicy(owners);
    await policy({ operation: 'create', id: 'f1', user: anna });

    const known = await policy({
      operation: 'read',
      id: 'f1',
      user: undefined,
    });
    const unknown = await policy({
      operation: 'read',
      id: 'f2',
      user: undefined,
    });

    expect(known).toBe(true);
    expect(unknown).toBe(false);
  });
});
