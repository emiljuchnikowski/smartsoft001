import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { PasswordStrengthUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: PasswordStrengthUsageExampleComponent', () => {
  let fixture: ComponentFixture<PasswordStrengthUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthUsageExampleComponent],
      // The app provides translations once, in app.config.ts.
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should rate the initial password and list the missing requirements', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('INPUT.PASSWORD-STRENGTH.poor');
    expect(element.textContent).toContain('INPUT.ERRORS.upperLetters');
  });

  it('should report a strong password to the handler', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="password"]',
    );

    input.value = 'Sunrise!2026';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.strong()).toBe(true);
  });
});
