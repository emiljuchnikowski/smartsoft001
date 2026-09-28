import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { InfoUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: InfoUsageExampleComponent', () => {
  let fixture: ComponentFixture<InfoUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoUsageExampleComponent],
      // App-wide services, provided once in the application's root config.
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should keep the hint hidden until the trigger is clicked', () => {
    const popover = fixture.nativeElement.querySelector(
      '[data-testid="info-popover"]',
    );

    expect(popover).toBeNull();
  });

  it('should show the text from the options when the trigger is clicked', () => {
    const trigger: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    trigger.click();
    fixture.detectChanges();

    const popover: HTMLElement = fixture.nativeElement.querySelector(
      '[data-testid="info-popover"]',
    );
    expect(popover.textContent).toContain(
      'We only use your email to send order updates.',
    );
  });
});
