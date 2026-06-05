import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverService, StyleService } from '@smartsoft001/angular';

import { ExportComponent } from './export.component';
import { CrudFacade } from '../../+state';

class SomeModel {}

describe('crud-shell-angular: ExportComponent (characterization)', () => {
  let loaded: WritableSignal<boolean | undefined>;

  function setup(
    filter: Record<string, unknown> = {},
  ): ComponentFixture<ExportComponent<any>> {
    loaded = signal<boolean | undefined>(false);
    const facadeMock = {
      export: jest.fn(),
      filter: signal(filter),
      loading: signal(false),
      loaded,
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

  // Flush pending toObservable effects + the popover close microtask.
  const flush = async () => {
    TestBed.tick();
    await Promise.resolve();
  };

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

  it('should export csv with reset offset/limit when csv button clicked', () => {
    const fixture = setup({ query: 'abc', offset: 50, limit: 10 });
    const facade = TestBed.inject(CrudFacade) as unknown as {
      export: jest.Mock;
    };

    fixture.componentInstance.buttonExportCsvOptions.click!();

    expect(facade.export).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'abc',
        offset: undefined,
        limit: undefined,
      }),
      'csv',
    );
  });

  it('should export xlsx when xlsx button clicked', () => {
    const fixture = setup();
    const facade = TestBed.inject(CrudFacade) as unknown as {
      export: jest.Mock;
    };

    fixture.componentInstance.buttonExportXlsxOptions.click!();

    expect(facade.export).toHaveBeenCalledWith(expect.any(Object), 'xlsx');
  });

  it('should not close the popover while loaded is false, then close once after loaded flips to true', async () => {
    const fixture = setup();
    const popover = TestBed.inject(PopoverService) as unknown as {
      close: jest.Mock;
    };
    fixture.detectChanges();

    fixture.componentInstance.buttonExportCsvOptions.click!();
    await flush();

    expect(popover.close).not.toHaveBeenCalled();

    loaded.set(true);
    await flush();

    expect(popover.close).toHaveBeenCalledTimes(1);
  });
});
