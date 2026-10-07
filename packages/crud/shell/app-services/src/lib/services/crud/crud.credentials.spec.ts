import { randomUUID } from 'node:crypto';

import { CrudService } from './crud.service';

describe('crud-app-services: credential response filtering', () => {
  const user = { username: 'alice', permissions: [] };
  // Ephemeral test-only sentinels, never credentials for an external service.
  const storedHash = randomUUID();
  const formValue = randomUUID();
  const refreshToken = randomUUID();
  const record = {
    id: 'id',
    name: 'Alice',
    password: storedHash,
    passwordConfirm: formValue,
    authRefreshToken: refreshToken,
  };
  const repository = {
    getById: async () => record,
    getByCriteria: async () => ({ data: [record], totalCount: 1 }),
    createMany: jest.fn(async () => undefined),
  };
  const service = new CrudService(
    { valid: () => undefined } as any,
    repository as any,
    {} as any,
    { type: class {} },
  );

  it('redacts credentials from detail without modifying the repository record', async () => {
    expect(await service.readById('id', user)).toEqual({
      id: 'id',
      name: 'Alice',
    });
    expect(record.password).toBe(storedHash);
    expect(record.authRefreshToken).toBe(refreshToken);
  });

  it('redacts credentials from lists and preserves totals', async () => {
    expect(await service.read({}, {}, user)).toEqual({
      data: [{ id: 'id', name: 'Alice' }],
      totalCount: 1,
    });
    expect(record.passwordConfirm).toBe(formValue);
  });

  it('returns safe bulk results without deleting persisted credentials', async () => {
    const data = [
      {
        id: '',
        password: formValue,
        passwordConfirm: formValue,
        authRefreshToken: refreshToken,
      },
    ];
    const result = await service.createMany(data, user, { mode: undefined });
    expect(result[0]).toEqual({ id: expect.any(String) });
    const stored = (
      repository.createMany.mock.calls[0] as unknown as [typeof data]
    )[0][0];
    expect(stored.password).toBeDefined();
    expect(stored.password).not.toBe(formValue);
    expect(stored.authRefreshToken).toBe(refreshToken);
  });
});
