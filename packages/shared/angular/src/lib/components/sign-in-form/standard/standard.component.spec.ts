import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFormStandardComponent } from './standard.component';
import { ISignInFormSocialClick, ISignInFormSubmit } from '../../../models';

describe('@smartsoft001/shared-angular: SignInFormStandardComponent', () => {
  let fixture: ComponentFixture<SignInFormStandardComponent>;
  let component: SignInFormStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInFormStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInFormStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should always render the wrapper', () => {
    const wrapper = fixture.nativeElement.querySelector('.sign-in-form');

    expect(wrapper).toBeTruthy();
  });

  it('should render <form> with email and password inputs', () => {
    const form = fixture.nativeElement.querySelector('form');
    const email = fixture.nativeElement.querySelector('input[type="email"]');
    const password = fixture.nativeElement.querySelector(
      'input[type="password"]',
    );

    expect(form).toBeTruthy();
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
  });

  it('should render labels by default', () => {
    const labels = fixture.nativeElement.querySelectorAll('label');

    expect(labels.length).toBe(2);
  });

  it('should hide labels when options.showLabels is false', () => {
    fixture.componentRef.setInput('options', { showLabels: false });
    fixture.detectChanges();

    const labels = fixture.nativeElement.querySelectorAll('label');

    expect(labels.length).toBe(0);
  });

  it('should default submit button label to "Sign in" when mode is "sign-in"', () => {
    const submitBtn = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    );

    expect(submitBtn.textContent.trim()).toBe('Sign in');
  });

  it('should change submit button label to "Sign up" when mode is "sign-up"', () => {
    fixture.componentRef.setInput('mode', 'sign-up');
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    );

    expect(submitBtn.textContent.trim()).toBe('Sign up');
  });

  it('should set autocomplete to "new-password" in sign-up mode', () => {
    fixture.componentRef.setInput('mode', 'sign-up');
    fixture.detectChanges();

    const password = fixture.nativeElement.querySelector(
      'input[type="password"]',
    );

    expect(password.getAttribute('autocomplete')).toBe('new-password');
  });

  it('should disable inputs and submit button when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const email: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="email"]',
    );
    const password: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="password"]',
    );
    const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    );

    expect(email.disabled).toBe(true);
    expect(password.disabled).toBe(true);
    expect(submitBtn.disabled).toBe(true);
  });

  it('should emit submit with email/password/mode on form submit', () => {
    const emitted: ISignInFormSubmit[] = [];
    component.submit.subscribe((value) => emitted.push(value));

    const email: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="email"]',
    );
    const password: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="password"]',
    );

    email.value = 'lindsay@example.com';
    email.dispatchEvent(new Event('input'));
    password.value = 'secret';
    password.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({
      email: 'lindsay@example.com',
      password: 'secret',
      mode: 'sign-in',
    });
  });

  it('should NOT emit submit when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const emitted: ISignInFormSubmit[] = [];
    component.submit.subscribe((value) => emitted.push(value));

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(emitted.length).toBe(0);
  });

  it('should render social provider buttons when options.socialProviders is provided', () => {
    fixture.componentRef.setInput('options', {
      socialProviders: [
        { id: 'google', label: 'Google' },
        { id: 'github', label: 'GitHub' },
      ],
    });
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.social');

    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('Google');
    expect(buttons[1].textContent.trim()).toBe('GitHub');
  });

  it('should emit socialClick with providerId+mode on social button click', () => {
    fixture.componentRef.setInput('options', {
      socialProviders: [{ id: 'google', label: 'Google' }],
    });
    fixture.detectChanges();

    const emitted: ISignInFormSocialClick[] = [];
    component.socialClick.subscribe((v) => emitted.push(v));

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.social');
    button.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ providerId: 'google', mode: 'sign-in' });
  });

  it('should render forgot-password link only in sign-in mode', () => {
    fixture.componentRef.setInput('options', {
      forgotPasswordHref: '/forgot',
    });
    fixture.detectChanges();

    let link = fixture.nativeElement.querySelector('a.forgot-password');

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/forgot');

    fixture.componentRef.setInput('mode', 'sign-up');
    fixture.detectChanges();

    link = fixture.nativeElement.querySelector('a.forgot-password');
    expect(link).toBeNull();
  });

  it('should apply external cssClass on the wrapper', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

    expect(wrapper.className).toContain('my-extra-class');
  });
});
