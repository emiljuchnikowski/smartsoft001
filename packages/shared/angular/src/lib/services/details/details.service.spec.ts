import { TestBed } from '@angular/core/testing';

import { DetailsService } from './details.service';

describe('angular: DetailsService', () => {
  let detailsService: DetailsService;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [DetailsService],
    });

    detailsService = TestBed.inject(DetailsService);
  });

  it('should be created', () => {
    expect(detailsService).toBeTruthy();
  });

  describe('get $root', () => {
    test('returns null after initialization', () => {
      expect(detailsService.$root).toBeNull();
    });

    test('returns the set object after setRoot', () => {
      const obj = { a: 1 };
      detailsService.setRoot(obj);
      expect(detailsService.$root).toBe(obj);
    });
  });

  describe('init', () => {
    test('sets _root to null', () => {
      detailsService.setRoot({ a: 1 });
      detailsService.init();
      expect(detailsService.$root).toBeNull();
    });

    test('keeps _root null after init', () => {
      detailsService.init();
      expect(detailsService.$root).toBeNull();
    });
  });

  describe('setRoot', () => {
    test('sets _root if it was null', () => {
      const obj = { b: 2 };
      detailsService.setRoot(obj);
      expect(detailsService.$root).toBe(obj);
    });

    test('does not overwrite _root if already set and force is false', () => {
      const obj1 = { c: 3 };
      const obj2 = { d: 4 };
      detailsService.setRoot(obj1);
      detailsService.setRoot(obj2);
      expect(detailsService.$root).toBe(obj1);
    });

    test('overwrites _root if force is true', () => {
      const obj1 = { e: 5 };
      const obj2 = { f: 6 };
      detailsService.setRoot(obj1);
      detailsService.setRoot(obj2, true);
      expect(detailsService.$root).toBe(obj2);
    });
  });
});
