import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFormUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: SignInFormUsageExampleComponent', () => {
  let fixture: ComponentFixture<SignInFormUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInFormUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInFormUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the form from the options', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(
      element.querySelector('button[type="submit"]')?.textContent,
    ).toContain('Sign in to your account');
    expect(element.textContent).toContain('Continue with Google');
  });

  // The output is named like the native DOM `submit` event, so the bubbling
  // SubmitEvent from the inner <form> reaches the same (submit) binding after
  // the typed payload. Assert on the payload call rather than the last call.
  it('should hand the credentials to the submit handler', () => {
    const onSubmit = jest.spyOn(fixture.componentInstance, 'onSubmit');
    const element = fixture.debugElement.nativeElement;
    const email: HTMLInputElement = element.querySelector(
      'input[type="email"]',
    );
    const password: HTMLInputElement = element.querySelector(
      'input[type="password"]',
    );
    const submit: HTMLButtonElement = element.querySelector(
      'button[type="submit"]',
    );

    email.value = 'anna@example.com';
    email.dispatchEvent(new Event('input'));
    password.value = 'Sunrise#2026';
    password.dispatchEvent(new Event('input'));
    submit.click();

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'anna@example.com',
      password: 'Sunrise#2026',
      mode: 'sign-in',
    });
  });

  it('should hand the provider id to the social click handler', () => {
    const social: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.social');

    social.click();

    expect(fixture.componentInstance.provider()).toBe('google');
  });
});
