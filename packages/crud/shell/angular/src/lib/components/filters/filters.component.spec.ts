import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MenuService, StyleService } from '@smartsoft001/angular';
import { Model } from '@smartsoft001/models';

import { FiltersComponent } from './filters.component';
import { CrudFacade } from '../../+state/crud.facade';
import { CrudConfig } from '../../crud.config';

@Model({
  filters: [
    { label: 'testNegation', key: 'body', type: '!=' },
    { label: 'select', key: 'type', type: '=' },
  ],
})
class SomeModel {}

describe('crud-shell-angular: FiltersComponent (characterization)', () => {
  let menuMock: { closeEnd: jest.Mock };

  function setup(): ComponentFixture<FiltersComponent<any>> {
    const facadeMock = { filter: signal(undefined), read: jest.fn() };
    menuMock = { closeEnd: jest.fn().mockResolvedValue(undefined) };
    const styleMock = { init: jest.fn() };
    const translateMock = {
      currentLang: 'en',
      get: jest.fn((key: string) => of(key)),
      stream: jest.fn((key: string) => of(key)),
      instant: jest.fn((k: string) => k),
      onLangChange: of(),
      onTranslationChange: of(),
      onDefaultLangChange: of(),
    };

    TestBed.configureTestingModule({
      imports: [FiltersComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        { provide: CrudConfig, useValue: { type: SomeModel } },
        { provide: MenuService, useValue: menuMock },
        { provide: StyleService, useValue: styleMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    });

    return TestBed.createComponent(FiltersComponent<any>);
  }

  it('should construct the concrete component', () => {
    const fixture = setup();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose inherited hideMenu input and onClose method', () => {
    const fixture = setup();

    expect(fixture.componentInstance.hideMenu()).toBe(false);
    expect(typeof fixture.componentInstance.onClose).toBe('function');
  });

  it('should initialize list and filter on ngOnInit', () => {
    const fixture = setup();

    fixture.detectChanges();

    expect(fixture.componentInstance.list).toBeTruthy();
    expect(Array.isArray(fixture.componentInstance.list())).toBe(true);
    expect(fixture.componentInstance.filter).toBeTruthy();
  });

  it('should render the filters title and close button when hideMenu is false', () => {
    const fixture = setup();

    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('header')).toBeTruthy();
    expect(el.querySelector('h2')?.textContent).toContain('filters');
    expect(el.querySelector('button[aria-label="close"]')).toBeTruthy();
  });

  it('should hide the header when hideMenu input is true', () => {
    const fixture = setup();
    fixture.componentRef.setInput('hideMenu', true);

    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('header')).toBeNull();
    expect(el.querySelector('button[aria-label="close"]')).toBeNull();
  });

  it('should render one smart-crud-filter per list entry', () => {
    const fixture = setup();

    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const items = el.querySelectorAll('smart-crud-filter');
    expect(items.length).toBe(fixture.componentInstance.list().length);
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it('should call menuService.closeEnd when close button is clicked', () => {
    const fixture = setup();
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="close"]',
    );
    button.click();

    expect(menuMock.closeEnd).toHaveBeenCalled();
  });
});
