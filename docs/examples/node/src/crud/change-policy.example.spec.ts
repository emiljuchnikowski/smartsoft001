import { IUser } from '@smartsoft001/users';

import { createChangePolicy } from './change-policy.example';

const anna: IUser = { username: 'anna', permissions: ['user'] };
const bob: IUser = { username: 'bob', permissions: ['user'] };

describe('docs-examples-node: change policy', () => {
  const notes = new Map([['n1', { owner: 'anna' }]]);
  let findOwner: jest.Mock<Promise<string | undefined>, [string]>;

  beforeEach(() => {
    findOwner = jest.fn(async (id: string) => notes.get(id)?.owner);
  });

  it('should let the owner subscribe', async () => {
    const policy = createChangePolicy(findOwner);

    const allowed = await policy({ id: 'n1', user: anna });

    expect(allowed).toBe(true);
  });

  it('should refuse another user', async () => {
    const policy = createChangePolicy(findOwner);

    const allowed = await policy({ id: 'n1', user: bob, type: 'update' });

    expect(allowed).toBe(false);
  });

  it('should allow a delete event without loading the deleted note', async () => {
    const policy = createChangePolicy(findOwner);

    const allowed = await policy({ id: 'gone', user: anna, type: 'delete' });

    expect(allowed).toBe(true);
    expect(findOwner).not.toHaveBeenCalled();
  });
});
