import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CrudListPaginationFactory } from './list-pagination.factory';
import { CrudFacade } from '../../+state/crud.facade';

describe('crud-shell-angular: CrudListPaginationFactory', () => {
  let factory: CrudListPaginationFactory<any>;
  let loaded: WritableSignal<boolean | undefined>;
  let read: jest.Mock;

  beforeEach(() => {
    loaded = signal<boolean | undefined>(false);
    read = jest.fn();
    const facadeMock = {
      loaded,
      read,
    } as unknown as Partial<CrudFacade<any>>;

    TestBed.configureTestingModule({
      providers: [
        CrudListPaginationFactory,
        { provide: CrudFacade, useValue: facadeMock },
      ],
    });

    factory = TestBed.inject(CrudListPaginationFactory);
  });

  // Flush pending toObservable effects + setTimeout macrotask.
  const flush = async () => {
    TestBed.tick();
    await new Promise((res) => setTimeout(res));
  };

  it('should not resolve loadNextPage until loaded flips to true, then resolve with the next link and call read once with incremented offset', async () => {
    // Arrange
    const links = { next: 'next-link' };
    let resolved: any = 'NOT_RESOLVED';
    const options = await factory.create({
      limit: 10,
      provider: {
        getLinks: () => links,
        getFilter: () => ({ offset: 0, limit: 10 }),
      },
    });

    // Act
    options.loadNextPage().then((value: any) => {
      resolved = value;
    });
    await flush();

    // Assert: pending while loaded is false
    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith({ offset: 10, limit: 10 });
    expect(resolved).toBe('NOT_RESOLVED');

    // Act: flip loaded to true
    loaded.set(true);
    await flush();

    // Assert
    expect(resolved).toBe('next-link');
  });

  it('should resolve loadNextPage to false and not call read when there is no next link', async () => {
    // Arrange
    const options = await factory.create({
      limit: 10,
      provider: {
        getLinks: () => ({}),
        getFilter: () => ({ offset: 0, limit: 10 }),
      },
    });

    // Act
    const resolved = await options.loadNextPage();

    // Assert
    expect(resolved).toBe(false);
    expect(read).not.toHaveBeenCalled();
  });

  it('should not resolve loadPrevPage until loaded flips to true, then resolve with the prev link and call read once with decremented offset', async () => {
    // Arrange
    const links = { prev: 'prev-link' };
    let resolved: any = 'NOT_RESOLVED';
    const options = await factory.create({
      limit: 10,
      provider: {
        getLinks: () => links,
        getFilter: () => ({ offset: 20, limit: 10 }),
      },
    });

    // Act
    options.loadPrevPage().then((value: any) => {
      resolved = value;
    });
    await flush();

    // Assert: pending while loaded is false
    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith({ offset: 10, limit: 10 });
    expect(resolved).toBe('NOT_RESOLVED');

    // Act: flip loaded to true
    loaded.set(true);
    await flush();

    // Assert
    expect(resolved).toBe('prev-link');
  });
});
