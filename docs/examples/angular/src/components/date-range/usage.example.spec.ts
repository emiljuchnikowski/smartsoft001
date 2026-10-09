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

  it('should render the bound range on the trigger', () => {
    // Arrange
    const [trigger]: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );

    // Assert
    expect(trigger.textContent).toContain('2026-04-01 - 2026-04-30');
  });

  it('should clear the range through the change handler', () => {
    // Arrange
    const [trigger, clear]: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );

    // Act
    clear.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.range()).toBeUndefined();
    expect(trigger.textContent).not.toContain('2026-04-01 - 2026-04-30');
    expect(fixture.nativeElement.querySelectorAll('button')).toHaveLength(1);
  });
});
