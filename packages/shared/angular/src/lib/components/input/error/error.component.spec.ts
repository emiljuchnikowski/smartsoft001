import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputErrorComponent } from './error.component';

@Component({
  selector: 'smart-test-host',
  template: `<smart-input-error [errors]="errors"></smart-input-error>`,
  imports: [InputErrorComponent],
})
class TestHostComponent {
  errors: any = undefined;
}

describe('@smartsoft001/shared-angular: InputErrorComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render no span when errors is undefined', () => {
    host.errors = undefined;
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeFalsy();
  });

  it('should render translated INPUT.ERRORS.required when errors.required is set', () => {
    host.errors = { required: true };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('INPUT.ERRORS.required');
  });

  it('should render translated INPUT.ERRORS.confirm when errors.confirm is set without required', () => {
    host.errors = { confirm: true };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('INPUT.ERRORS.confirm');
  });

  it('should not render INPUT.ERRORS.confirm when both required and confirm are set', () => {
    host.errors = { required: true, confirm: true };
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('INPUT.ERRORS.required');
    expect(text).not.toContain('INPUT.ERRORS.confirm');
  });

  it('should render translated INPUT.ERRORS.invalidNip when errors.invalidNip is set', () => {
    host.errors = { invalidNip: true };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('INPUT.ERRORS.invalidNip');
  });

  it('should render translated INPUT.ERRORS.invalidUnique when errors.invalidUnique is set', () => {
    host.errors = { invalidUnique: true };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('INPUT.ERRORS.invalidUnique');
  });

  it('should render translated INPUT.ERRORS.invalidEmailFormat when errors.email is set', () => {
    host.errors = { email: true };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('INPUT.ERRORS.invalidEmailFormat');
  });

  it('should render translated INPUT.ERRORS.invalidPhoneNumberFormat when errors.phoneNumber is set', () => {
    host.errors = { phoneNumber: true };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('INPUT.ERRORS.invalidPhoneNumberFormat');
  });

  it('should render translated INPUT.ERRORS.invalidPeselFormat when errors.pesel is set', () => {
    host.errors = { pesel: true };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('INPUT.ERRORS.invalidPeselFormat');
  });

  it('should render INPUT.ERRORS.invalidMinLength with requiredLength when errors.minlength is set', () => {
    host.errors = { minlength: { requiredLength: 5 } };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('INPUT.ERRORS.invalidMinLength');
    expect(span.textContent).toContain('5');
  });

  it('should render INPUT.ERRORS.invalidMaxLength with requiredLength when errors.maxlength is set', () => {
    host.errors = { maxlength: { requiredLength: 10 } };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('INPUT.ERRORS.invalidMaxLength');
    expect(span.textContent).toContain('10');
  });

  it('should render INPUT.ERRORS.invalidMin with min value when errors.min is set', () => {
    host.errors = { min: { min: 1 } };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('INPUT.ERRORS.invalidMin');
    expect(span.textContent).toContain('1');
  });

  it('should render INPUT.ERRORS.invalidMax with max value when errors.max is set', () => {
    host.errors = { max: { max: 99 } };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('INPUT.ERRORS.invalidMax');
    expect(span.textContent).toContain('99');
  });

  it('should render raw customMessage text when errors.customMessage is set', () => {
    host.errors = { customMessage: 'Custom error' };
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');

    expect(span).toBeTruthy();
    expect(span.textContent).toContain('Custom error');
  });
});
