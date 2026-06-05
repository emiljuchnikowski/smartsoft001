import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { MenuService, StyleService } from '@smartsoft001/angular';

import { FiltersComponent } from './filters.component';
import { CrudFacade } from '../../+state/crud.facade';
import { CrudConfig } from '../../crud.config';

class SomeModel {}

describe('crud-shell-angular: FiltersComponent (characterization)', () => {
  function setup(): ComponentFixture<FiltersComponent<any>> {
    const facadeMock = { filter: signal(undefined), read: jest.fn() };
    const menuMock = { closeEnd: jest.fn().mockResolvedValue(undefined) };
    const styleMock = { init: jest.fn() };
    const translateMock = {
      currentLang: 'en',
      get: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
      instant: jest.fn((k: string) => k),
      onLangChange: { subscribe: jest.fn() },
      onTranslationChange: { subscribe: jest.fn() },
      onDefaultLangChange: { subscribe: jest.fn() },
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
});
