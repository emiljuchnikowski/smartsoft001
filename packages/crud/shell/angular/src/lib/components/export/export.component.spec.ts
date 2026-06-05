import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverService, StyleService } from '@smartsoft001/angular';

import { ExportComponent } from './export.component';
import { CrudFacade } from '../../+state';

class SomeModel {}

describe('crud-shell-angular: ExportComponent (characterization)', () => {
  function setup(): ComponentFixture<ExportComponent<any>> {
    const facadeMock = {
      export: jest.fn(),
      filter: signal({}),
      loading: signal(false),
    };
    const popoverMock = { close: jest.fn().mockResolvedValue(undefined) };
    const styleMock = { init: jest.fn() };

    TestBed.configureTestingModule({
      imports: [ExportComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        { provide: PopoverService, useValue: popoverMock },
        { provide: StyleService, useValue: styleMock },
      ],
    });

    return TestBed.createComponent(ExportComponent<any>);
  }

  it('should construct the concrete component', () => {
    const fixture = setup();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose inherited export button options', () => {
    const fixture = setup();

    expect(fixture.componentInstance.buttonExportCsvOptions).toBeTruthy();
    expect(fixture.componentInstance.buttonExportXlsxOptions).toBeTruthy();
  });

  it('should call styleService.init on ngOnInit', () => {
    const fixture = setup();
    const styleService = TestBed.inject(StyleService) as unknown as {
      init: jest.Mock;
    };

    fixture.detectChanges();

    expect(styleService.init).toHaveBeenCalled();
  });

  it('should export csv when csv button clicked', () => {
    const fixture = setup();
    const facade = TestBed.inject(CrudFacade) as unknown as {
      export: jest.Mock;
    };

    fixture.componentInstance.buttonExportCsvOptions.click!();

    expect(facade.export).toHaveBeenCalledWith(expect.any(Object), 'csv');
  });
});
