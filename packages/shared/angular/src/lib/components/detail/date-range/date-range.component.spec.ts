import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailDateRangeComponent } from './date-range.component';
import { IDetailOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-date-range
      [options]="options"
      [class]="cssClass"
    ></smart-detail-date-range>
  `,
  imports: [DetailDateRangeComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailDateRangeComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render <p> with range values from options.item()[key]', () => {
    host.options = {
      key: 'period',
      item: signal({
        period: { start: '2025-01-01', end: '2025-12-31' },
      } as any),
      options: { type: FieldType.dateRange },
    };
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p).toBeTruthy();
    expect(p.textContent).toContain('2025-01-01');
    expect(p.textContent).toContain('2025-12-31');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'period',
      item: signal(undefined),
      options: { type: FieldType.dateRange },
    };
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p).toBeFalsy();
  });

  it('should append cssClass to the <p> element', () => {
    host.options = {
      key: 'period',
      item: signal({
        period: { start: '2025-01-01', end: '2025-12-31' },
      } as any),
      options: { type: FieldType.dateRange },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p.className).toContain('my-custom-class');
    expect(p.className).toContain('smart:text-sm');
  });
});
