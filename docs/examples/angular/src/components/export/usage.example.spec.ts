import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ExportUsageExampleComponent', () => {
  let fixture: ComponentFixture<ExportUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should enable the export button when there is a value', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(false);
  });

  it('should hand the value to the handler when clicked', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    button.click();

    expect(fixture.componentInstance.exported()).toEqual(
      fixture.componentInstance.orders,
    );
  });

  it('should hand the file name to the handler when clicked', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    button.click();

    expect(fixture.componentInstance.exportedFileName()).toBe('orders.csv');
  });

  it('should give the icon-only button an accessible name', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    expect(button.textContent?.trim()).toBe('Export');
  });
});
