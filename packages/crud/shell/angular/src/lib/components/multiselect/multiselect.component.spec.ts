import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { MenuService } from '@smartsoft001/angular';

import { MultiselectComponent } from './multiselect.component';
import { CrudFacade } from '../../+state';
import { CrudFullConfig } from '../../crud.config';

class SomeModel {}

describe('crud-shell-angular: MultiselectComponent (characterization)', () => {
  function setup(): ComponentFixture<MultiselectComponent<any>> {
    const facadeMock = {
      multiSelected: signal([]),
      updatePartialMany: jest.fn(),
    };
    const menuMock = { closeEnd: jest.fn().mockResolvedValue(undefined) };
    const translateMock = {
      currentLang: 'en',
      get: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
      instant: jest.fn((k: string) => k),
      onLangChange: { subscribe: jest.fn() },
      onTranslationChange: { subscribe: jest.fn() },
      onDefaultLangChange: { subscribe: jest.fn() },
    };

    TestBed.configureTestingModule({
      imports: [MultiselectComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        { provide: CrudFullConfig, useValue: { type: SomeModel } },
        { provide: MenuService, useValue: menuMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    });

    return TestBed.createComponent(MultiselectComponent<any>);
  }

  it('should construct the concrete component', () => {
    const fixture = setup();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose inherited public fields', () => {
    const fixture = setup();
    const instance = fixture.componentInstance;

    expect(instance.config).toBeTruthy();
    expect(instance.buttonOptions).toBeTruthy();
    expect(instance.list).toBeTruthy();
    expect(instance.showForm).toBe(false);
  });

  it('should set valid via onValidChange', () => {
    const fixture = setup();

    fixture.componentInstance.onValidChange(true);

    expect(fixture.componentInstance.valid).toBe(true);
  });

  it('should capture changes and list via onPartialChange', () => {
    const fixture = setup();

    fixture.componentInstance.onPartialChange({ id: '1' } as any, [
      { id: '1' } as any,
    ]);

    expect(fixture.componentInstance.lock).toBe(false);
  });

  describe('header (GAP-25)', () => {
    function setupWithItems(): {
      fixture: ComponentFixture<MultiselectComponent<any>>;
      menuMock: { closeEnd: jest.Mock };
    } {
      const facadeMock = {
        multiSelected: signal([{ id: '1' }, { id: '2' }]),
        updatePartialMany: jest.fn(),
      };
      const menuMock = { closeEnd: jest.fn().mockResolvedValue(undefined) };
      const translateMock = {
        currentLang: 'en',
        get: jest.fn((k: string) => ({
          subscribe: (fn: (v: string) => void) => {
            fn(k);
            return { unsubscribe: jest.fn() };
          },
        })),
        instant: jest.fn((k: string) => k),
        onLangChange: { subscribe: jest.fn() },
        onTranslationChange: { subscribe: jest.fn() },
        onDefaultLangChange: { subscribe: jest.fn() },
      };

      TestBed.configureTestingModule({
        imports: [MultiselectComponent],
        providers: [
          { provide: CrudFacade, useValue: facadeMock },
          { provide: CrudFullConfig, useValue: { type: SomeModel } },
          { provide: MenuService, useValue: menuMock },
          { provide: TranslateService, useValue: translateMock },
        ],
      });

      const fixture = TestBed.createComponent(MultiselectComponent<any>);
      fixture.detectChanges();

      return { fixture, menuMock };
    }

    it('should render a header with the translated selected title and count', () => {
      const { fixture } = setupWithItems();

      const header: HTMLElement | null =
        fixture.nativeElement.querySelector('header');

      expect(header).toBeTruthy();
      expect(header?.textContent).toContain('selected');
      expect(header?.textContent).toContain('2');
    });

    it('should render a close button that calls menuService.closeEnd on click', () => {
      const { fixture, menuMock } = setupWithItems();

      const closeButton: HTMLButtonElement | null =
        fixture.nativeElement.querySelector('header button');
      closeButton?.click();

      expect(menuMock.closeEnd).toHaveBeenCalled();
    });
  });
});
