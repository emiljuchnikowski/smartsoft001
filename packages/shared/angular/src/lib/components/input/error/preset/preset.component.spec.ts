import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputErrorPresetComponent } from './preset.component';

@Component({
  selector: 'smart-test-host',
  template: `<smart-input-error-preset
    [errors]="errors"
  ></smart-input-error-preset>`,
  imports: [InputErrorPresetComponent],
})
class TestHostComponent {
  errors: any = undefined;
}

describe('@smartsoft001/shared-angular: InputErrorPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(host).toBeTruthy();
  });

  it('should render no message when errors is undefined', () => {
    host.errors = undefined;
    fixture.detectChanges();

    const message = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="error-message"]',
    );

    expect(message).toBeFalsy();
  });

  it('should render translated INPUT.ERRORS.required when errors.required is set', () => {
    host.errors = { required: true };
    fixture.detectChanges();

    const message = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="error-message"]',
    );

    expect(message).toBeTruthy();
    expect(message?.textContent).toContain('INPUT.ERRORS.required');
  });

  it('should apply Preline red validation classes to the message', () => {
    host.errors = { required: true };
    fixture.detectChanges();

    const message = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="error-message"]',
    ) as HTMLElement;

    expect(message.className).toContain('smart:text-red-500');
    expect(message.className).toContain('smart:dark:text-red-400');
    expect(message.className).toContain('smart:flex');
    expect(message.className).toContain('smart:mt-2');
  });

  it('should render the alert icon with red validation classes', () => {
    host.errors = { required: true };
    fixture.detectChanges();

    const icon = (fixture.nativeElement as HTMLElement).querySelector('svg');

    expect(icon).toBeTruthy();
    expect(icon?.getAttribute('class')).toContain('smart:text-red-500');
    expect(icon?.getAttribute('class')).toContain('smart:size-4');
  });

  it('should mark the message with role="alert"', () => {
    host.errors = { required: true };
    fixture.detectChanges();

    const message = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="error-message"]',
    );

    expect(message?.getAttribute('role')).toBe('alert');
  });

  it('should render INPUT.ERRORS.confirm when errors.confirm is set without required', () => {
    host.errors = { confirm: true };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('INPUT.ERRORS.confirm');
  });

  it('should not render INPUT.ERRORS.confirm when both required and confirm are set', () => {
    host.errors = { required: true, confirm: true };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('INPUT.ERRORS.required');
    expect(text).not.toContain('INPUT.ERRORS.confirm');
  });

  it('should render INPUT.ERRORS.invalidNip when errors.invalidNip is set', () => {
    host.errors = { invalidNip: true };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('INPUT.ERRORS.invalidNip');
  });

  it('should render INPUT.ERRORS.invalidUnique when errors.invalidUnique is set', () => {
    host.errors = { invalidUnique: true };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('INPUT.ERRORS.invalidUnique');
  });

  it('should render INPUT.ERRORS.invalidEmailFormat when errors.email is set', () => {
    host.errors = { email: true };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('INPUT.ERRORS.invalidEmailFormat');
  });

  it('should render INPUT.ERRORS.invalidPhoneNumberFormat when errors.phoneNumber is set', () => {
    host.errors = { phoneNumber: true };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('INPUT.ERRORS.invalidPhoneNumberFormat');
  });

  it('should render INPUT.ERRORS.invalidPeselFormat when errors.pesel is set', () => {
    host.errors = { pesel: true };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('INPUT.ERRORS.invalidPeselFormat');
  });

  it('should render INPUT.ERRORS.invalidMinLength with requiredLength when errors.minlength is set', () => {
    host.errors = { minlength: { requiredLength: 5 } };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('INPUT.ERRORS.invalidMinLength');
    expect(text).toContain('5');
  });

  it('should render INPUT.ERRORS.invalidMaxLength with requiredLength when errors.maxlength is set', () => {
    host.errors = { maxlength: { requiredLength: 10 } };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('INPUT.ERRORS.invalidMaxLength');
    expect(text).toContain('10');
  });

  it('should render INPUT.ERRORS.invalidMin with min value when errors.min is set', () => {
    host.errors = { min: { min: 1 } };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('INPUT.ERRORS.invalidMin');
    expect(text).toContain('1');
  });

  it('should render INPUT.ERRORS.invalidMax with max value when errors.max is set', () => {
    host.errors = { max: { max: 99 } };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('INPUT.ERRORS.invalidMax');
    expect(text).toContain('99');
  });

  it('should render raw customMessage text when errors.customMessage is set', () => {
    host.errors = { customMessage: 'Custom error' };
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Custom error');
  });
});
