import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ArrayService } from '@smartsoft001/utils';
import { BehaviorSubject } from 'rxjs';

import { AppService } from './app.service';

describe('angular: AppService', () => {
  let appService: AppService;

  const mockTitle = { getTitle: jest.fn(), setTitle: jest.fn() };
  const mockTranslate = { instant: jest.fn() };
  const mockRouterEvents$ = new BehaviorSubject<any>(null);
  const mockRouter = { events: mockRouterEvents$.asObservable() };
  const mockArrayService = {
    addItem: jest.fn((arr, item) => [...arr, item]),
    removeItem: jest.fn((arr, item) => arr.filter((i: any) => i !== item)),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockTitle.getTitle.mockReturnValue('BaseTitle');
    mockTranslate.instant.mockImplementation((key) => key);
    mockArrayService.addItem.mockImplementation((arr, item) => [...arr, item]);
    mockArrayService.removeItem.mockImplementation((arr, item) =>
      arr.filter((i: any) => i !== item),
    );
    mockRouterEvents$.next(null);

    TestBed.configureTestingModule({
      providers: [
        AppService,
        { provide: Title, useValue: mockTitle },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: Router, useValue: mockRouter },
        { provide: ArrayService, useValue: mockArrayService },
      ],
    });

    appService = TestBed.inject(AppService);
    // Reset BehaviorSubjects
    (AppService as any)._endButtonsSource$ = new BehaviorSubject<any[]>([]);
    (AppService as any)._titleSource$ = new BehaviorSubject<string>('');
  });

  it('should be created', () => {
    expect(appService).toBeTruthy();
  });

  describe('addEndButton', () => {
    it('adds a new button', () => {
      const button = { id: '1', icon: 'test-icon' };
      appService.addEndButton(button);
      appService.endButtons$.subscribe((val) => {
        expect(val).toContainEqual(button);
      });
    });
    it('updates existing button by id', () => {
      const button = { id: '1', icon: 'test-icon' };
      appService.addEndButton(button);
      const updated = { id: '1', icon: 'updated-icon' };
      appService.addEndButton(updated);
      appService.endButtons$.subscribe((val) => {
        expect(val.find((b) => b.id === '1')?.icon).toBe('updated-icon');
      });
    });
    it('adds button without id', () => {
      const button = { icon: 'noid-icon' };
      appService.addEndButton(button as any);
      appService.endButtons$.subscribe((val) => {
        expect(val.some((b) => b.icon === 'noid-icon')).toBe(true);
      });
    });
  });
  describe('removeEndButton', () => {
    it('removes button by object with id', () => {
      const button = { id: '1', icon: 'test-icon' };
      appService.addEndButton(button);
      appService.removeEndButton(button);
      appService.endButtons$.subscribe((val) => {
        expect(val).not.toContainEqual(button);
      });
    });
    it('removes button by id (string)', () => {
      const button = { id: '2', icon: 'test-icon' };
      appService.addEndButton(button);
      appService.removeEndButton('2');
      appService.endButtons$.subscribe((val) => {
        expect(val.some((b) => b.id === '2')).toBe(false);
      });
    });
    it('removes button by object without id', () => {
      const button = { icon: 'noid-icon' };
      appService.addEndButton(button as any);
      appService.removeEndButton(button as any);
      appService.endButtons$.subscribe((val) => {
        expect(val.some((b) => b.icon === 'noid-icon')).toBe(false);
      });
    });
  });
  describe('initTitle', () => {
    it('sets title based on routing', () => {
      appService.initTitle();
      mockRouterEvents$.next(new NavigationEnd(1, '/old', '/new/url?param=1'));
      expect(mockTitle.setTitle).toHaveBeenCalled();
    });
    it('updates title BehaviorSubject', (done) => {
      appService.initTitle();
      mockRouterEvents$.next(new NavigationEnd(1, '/old', '/new/url'));
      appService.title$.subscribe((val) => {
        expect(val).toContain('BaseTitle');
        done();
      });
    });
  });
});
