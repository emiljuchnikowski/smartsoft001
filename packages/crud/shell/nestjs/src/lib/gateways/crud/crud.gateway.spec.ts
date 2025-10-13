import 'reflect-metadata';

import { of } from 'rxjs';

import { CrudService } from '@smartsoft001/crud-shell-app-services';

import { CrudGateway } from './crud.gateway';

describe('crud-nestjs: CrudGateway', () => {
  let service: jest.Mocked<CrudService<any>>;
  let gateway: CrudGateway<any>;
  let client: any;

  beforeEach(() => {
    service = {
      changes: jest.fn(),
    } as any;
    gateway = new CrudGateway(service);
    gateway['afterInit']({});
    client = { id: 'client1' };
  });

  describe('afterInit', () => {
    it('should initialize _clientsSubscriptions', () => {
      const gw = new CrudGateway(service);
      gw['afterInit']({});
      expect(gw['_clientsSubscriptions']).toBeInstanceOf(Map);
    });
  });

  describe('handleConnection', () => {
    it('should log client connection', () => {
      client.id = 'abc';
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      gateway.handleConnection(client);
      expect(logSpy).toHaveBeenCalledWith('Client connected: abc');
      logSpy.mockRestore();
    });
  });

  describe('handleDisconnect', () => {
    it('should clear subscription and log disconnect', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      const unsub = jest.fn();
      gateway['_clientsSubscriptions'].set(client.id, {
        unsubscribe: unsub,
      } as any);
      gateway.handleDisconnect(client);
      expect(unsub).toHaveBeenCalled();
      logSpy.mockRestore();
    });
  });

  describe('clearSubscription', () => {
    it('should unsubscribe and delete if present', () => {
      const unsub = jest.fn();
      gateway['_clientsSubscriptions'].set(client.id, {
        unsubscribe: unsub,
      } as any);
      gateway['clearSubscription'](client);
      expect(gateway['_clientsSubscriptions'].has(client.id)).toBe(false);
    });
    it('should do nothing if not present', () => {
      expect(() => gateway['clearSubscription'](client)).not.toThrow();
    });
  });

  describe('handleFilter', () => {
    //TODO: testowanie observable
    // it('should subscribe to service.changes and emit events', done => {
    //   const res: ItemChangedData = { type: 'update', id: '1', data: {
    //       removedFields: [],
    //       updatedFields: {}
    //     } };
    //   service.changes.mockReturnValue(of(res));
    //   const observer = gateway.handleFilter({}, client).subscribe({
    //     next: (msg) => {
    //       expect(msg).toEqual({ event: 'changes', data: res });
    //       observer.unsubscribe();
    //       done();
    //     }
    //   });
    // });
    //
    // it('should handle errors from service.changes', done => {
    //   service.changes.mockReturnValue(throwError(() => new Error('fail')));
    //   const observer = gateway.handleFilter({}, client).subscribe({
    //     error: (err) => {
    //       expect(err).toBeInstanceOf(Error);
    //       observer.unsubscribe();
    //       done();
    //     }
    //   });
    // });

    it('should clear previous subscription before subscribing', () => {
      const unsub = jest.fn();
      gateway['_clientsSubscriptions'].set(client.id, {
        unsubscribe: unsub,
      } as any);
      service.changes.mockReturnValue(
        of({
          type: 'update',
          id: '1',
          data: { removedFields: [], updatedFields: {} },
        }),
      );
      gateway.handleFilter({}, client).subscribe().unsubscribe();
      expect(unsub).toHaveBeenCalled();
    });

    it('should store new subscription in _clientsSubscriptions', () => {
      service.changes.mockReturnValue(
        of({
          type: 'update',
          id: '1',
          data: { removedFields: [], updatedFields: {} },
        }),
      );
      gateway.handleFilter({}, client).subscribe().unsubscribe();
      expect(gateway['_clientsSubscriptions'].has(client.id)).toBe(true);
    });
  });
});
