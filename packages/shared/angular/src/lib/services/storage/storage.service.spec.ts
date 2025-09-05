import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear(); // Clear localStorage before each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get an item', () => {
    const key = 'testKey';
    const value = { data: 'testData' };
    service.setItem(key, value);
    expect(service.getItem(key)).toEqual(value);
  });

  it('should return null for a non-existent item', () => {
    expect(service.getItem('nonExistentKey')).toBeNull();
  });

  it('should remove an item', () => {
    const key = 'testKey';
    const value = 'testValue';
    service.setItem(key, value);
    service.removeItem(key);
    expect(service.getItem(key)).toBeNull();
  });

  it('should handle null value when setting item (removes it)', () => {
    const key = 'testKey';
    service.setItem(key, 'initialValue');
    service.setItem(key, null);
    expect(service.getItem(key)).toBeNull();
  });

  it('should handle undefined value when setting item (removes it)', () => {
    const key = 'testKey';
    service.setItem(key, 'initialValue');
    service.setItem(key, undefined);
    expect(service.getItem(key)).toBeNull();
  });

  it('should clear all items', () => {
    service.setItem('key1', 'value1');
    service.setItem('key2', 'value2');
    service.clear();
    expect(service.getItem('key1')).toBeNull();
    expect(service.getItem('key2')).toBeNull();
  });

  // Edge case: storing non-serializable might be an issue with JSON.stringify,
  // but the service as defined uses JSON.stringify.
  // Test for basic error handling (console.error) might be complex in unit tests
  // without spies on console.error and is often an integration concern.
});
