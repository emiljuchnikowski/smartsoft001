import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailDateRangePresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-date-range-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-date-range-preset>
  `,
  imports: [DetailDateRangePresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

const RANGE = { start: '2026-01-01', end: '2026-01-31' };

describe('@smartsoft001/shared-angular: DetailDateRangePresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render start and end as two chips', () => {
    host.options = {
      key: 'range',
      item: signal({ range: RANGE } as any),
      options: { type: FieldType.dateRange },
    };
    fixture.detectChanges();

    const start = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="start"]',
    ) as HTMLElement;
    const end = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="end"]',
    ) as HTMLElement;

    expect(start.textContent?.trim()).toBe('2026-01-01');
    expect(end.textContent?.trim()).toBe('2026-01-31');
    expect(start.className).toContain('smart:bg-gray-100');
    expect(end.className).toContain('smart:bg-gray-100');
  });

  it('should render nothing when the range is undefined', () => {
    host.options = {
      key: 'range',
      item: signal({ range: undefined } as any),
      options: { type: FieldType.dateRange },
    };
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="range"]',
    );

    expect(container).toBeFalsy();
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'range',
      item: signal(undefined),
      options: { type: FieldType.dateRange },
    };
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="range"]',
    );

    expect(container).toBeFalsy();
  });

  it('should append cssClass to the container', () => {
    host.options = {
      key: 'range',
      item: signal({ range: RANGE } as any),
      options: { type: FieldType.dateRange },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="range"]',
    ) as HTMLElement;

    expect(container.className).toContain('my-custom-class');
    expect(container.className).toContain('smart:inline-flex');
  });
});
