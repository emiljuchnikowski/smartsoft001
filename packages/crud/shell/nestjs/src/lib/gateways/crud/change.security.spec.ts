import { JwtService } from '@nestjs/jwt';
import { firstValueFrom, of, Subject } from 'rxjs';

import { CrudGateway } from './crud.gateway';

describe('crud-nestjs: change subscription authorization', () => {
  const jwt = new JwtService({ secret: 'synthetic-change-test-key' });
  const token = jwt.sign(
    { sub: 'alice', permissions: ['user'] },
    { expiresIn: 60 },
  );
  const client = { id: 'client', handshake: { auth: { token } } } as any;
  const change = {
    id: 'alice-file',
    type: 'update',
    data: {
      updatedFields: { password: 'secret', authRefreshToken: 'secret' },
      removedFields: [],
    },
  };
  it('denies anonymous, unconfigured and unscoped subscriptions without opening the repository', async () => {
    const changes = jest.fn(() => of(change));
    const service = { changes } as any;
    await expect(
      firstValueFrom(
        new CrudGateway(service).handleFilter({ id: 'alice-file' }, client),
      ),
    ).rejects.toThrow();
    const gateway = new CrudGateway(service, { changePolicy: () => true }, jwt);
    await expect(
      firstValueFrom(gateway.handleFilter({}, client)),
    ).rejects.toThrow();
    await expect(
      firstValueFrom(
        gateway.handleFilter({ id: 'alice-file' }, { id: 'anonymous' } as any),
      ),
    ).rejects.toThrow();
    expect(changes).not.toHaveBeenCalled();
  });
  it('checks resource ownership and emits no document fields', async () => {
    const changes = jest.fn(() => of(change));
    const gateway = new CrudGateway(
      { changes } as any,
      {
        changePolicy: ({ id, user }) =>
          id === 'alice-file' && user.username === 'alice',
      },
      jwt,
    );
    await expect(
      firstValueFrom(gateway.handleFilter({ id: 'bob-file' }, client)),
    ).rejects.toThrow();
    expect(changes).not.toHaveBeenCalled();
    expect(
      await firstValueFrom(gateway.handleFilter({ id: 'alice-file' }, client)),
    ).toEqual({ event: 'changes', data: { id: 'alice-file', type: 'update' } });
  });
  it('rechecks the policy on an event after access is revoked', async () => {
    const stream = new Subject<any>();
    let allowed = true;
    let opened!: () => void;
    const ready = new Promise<void>((resolve) => {
      opened = resolve;
    });
    const gateway = new CrudGateway(
      {
        changes: () => {
          opened();
          return stream;
        },
      } as any,
      { changePolicy: () => allowed },
      jwt,
    );
    const result = firstValueFrom(
      gateway.handleFilter({ id: 'alice-file' }, client),
    );
    const rejection = expect(result).rejects.toThrow(
      'Change subscription denied',
    );
    await ready;
    allowed = false;
    stream.next(change);
    await rejection;
    expect(gateway['_clientsSubscriptions'].size).toBe(0);
  });
  it('rejects a token signed by a different key', async () => {
    const changes = jest.fn();
    const gateway = new CrudGateway(
      { changes } as any,
      { changePolicy: () => true },
      jwt,
    );
    const invalid = {
      ...client,
      handshake: {
        auth: {
          token: new JwtService({ secret: 'different' }).sign({ sub: 'alice' }),
        },
      },
    };
    await expect(
      firstValueFrom(gateway.handleFilter({ id: 'alice-file' }, invalid)),
    ).rejects.toThrow();
    expect(changes).not.toHaveBeenCalled();
  });
  it('rejects an expired token before opening the repository', async () => {
    const changes = jest.fn();
    const gateway = new CrudGateway(
      { changes } as any,
      { changePolicy: () => true },
      jwt,
    );
    const expired = {
      ...client,
      handshake: {
        auth: { token: jwt.sign({ sub: 'alice' }, { expiresIn: -1 }) },
      },
    };
    await expect(
      firstValueFrom(gateway.handleFilter({ id: 'alice-file' }, expired)),
    ).rejects.toThrow();
    expect(changes).not.toHaveBeenCalled();
  });
  it('passes the change type so a resource-loading policy can still authorize a delete', async () => {
    const stored = new Map([['alice-file', { owner: 'alice' }]]);
    const stream = new Subject<any>();
    const seenTypes: Array<string | undefined> = [];
    const gateway = new CrudGateway(
      { changes: () => stream } as any,
      {
        changePolicy: async ({ id, user, type }) => {
          seenTypes.push(type);
          // The document is gone when Mongo emits the delete, so a lookup would deny it.
          if (type === 'delete') return true;
          return stored.get(id)?.owner === user.username;
        },
      },
      jwt,
    );
    const received: unknown[] = [];
    let error: unknown;
    const settle = () => new Promise((resolve) => setTimeout(resolve, 20));
    const subscription = gateway
      .handleFilter({ id: 'alice-file' }, client)
      .subscribe({
        next: (event) => received.push(event),
        error: (e) => (error = e),
      });
    await settle();

    stream.next(change);
    await settle();
    stored.delete('alice-file');
    stream.next({ id: 'alice-file', type: 'delete' });
    await settle();
    subscription.unsubscribe();

    expect(error).toBeUndefined();
    expect(received).toEqual([
      { event: 'changes', data: { id: 'alice-file', type: 'update' } },
      { event: 'changes', data: { id: 'alice-file', type: 'delete' } },
    ]);
    expect(seenTypes).toEqual([undefined, 'update', 'delete']);
  });
});
