import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { DateRangeUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DateRangeUsageExampleComponent', () => {
  let fixture: ComponentFixture<DateRangeUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangeUsageExampleComponent],
      // App-wide services, provided once in the application's root config.
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangeUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the bound range', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('2026-04-01 - 2026-04-30');
  });

  it('should hand the cleared range to the change handler', () => {
    const [, clear]: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );

    clear.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.range()).toBeUndefined();
  });
});
