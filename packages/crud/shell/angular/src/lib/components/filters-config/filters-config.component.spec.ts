import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { StyleService } from '@smartsoft001/angular';

import { FiltersConfigComponent } from './filters-config.component';
import { CrudFacade } from '../../+state/crud.facade';
import { ICrudFilter } from '../../models';

describe('crud-shell-angular: FiltersConfigComponent', () => {
  let facadeMock: { filter: WritableSignal<ICrudFilter>; read: jest.Mock };

  function setup(
    filter: ICrudFilter = {
      query: [
        { key: 'name', type: '=', value: 'a' },
        { key: 'age', type: '>=', value: '18' },
      ],
    },
  ): ComponentFixture<FiltersConfigComponent> {
    facadeMock = { filter: signal(filter), read: jest.fn() };
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
      imports: [FiltersConfigComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        { provide: StyleService, useValue: styleMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    });

    return TestBed.createComponent(FiltersConfigComponent);
  }

  it('should construct the component', () => {
    const fixture = setup();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render one chip button per visible query item with expected label text', () => {
    const fixture = setup();

    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll('button[type="button"]');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('MODEL.name');
    expect(buttons[0].textContent).toContain('=');
    expect(buttons[0].textContent).toContain('a');
    expect(buttons[1].textContent).toContain('MODEL.age');
    expect(buttons[1].textContent).toContain('>=');
    expect(buttons[1].textContent).toContain('18');
  });

  it('should remove the item and call facade.read when a chip is clicked', () => {
    const fixture = setup();
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="button"]',
    );
    button.click();

    expect(facadeMock.filter().query).toEqual([
      { key: 'age', type: '>=', value: '18' },
    ]);
    expect(facadeMock.read).toHaveBeenCalledWith(facadeMock.filter());
  });

  it('should not render hidden query items', () => {
    const fixture = setup({
      query: [
        { key: 'name', type: '=', value: 'a' },
        { key: 'secret', type: '=', value: 'x', hidden: true },
      ],
    });

    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll('button[type="button"]');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent).toContain('MODEL.name');
    expect(buttons[0].textContent).not.toContain('MODEL.secret');
  });
});
