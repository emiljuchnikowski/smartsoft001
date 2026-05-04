import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFormBaseComponent } from './base/base.component';
import { SignInFormComponent } from './sign-in-form.component';
import { SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-sign-in-form-injected',
  template: '<div class="injected-sign-in-form">injected</div>',
})
class MockInjectedComponent extends SignInFormBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: SignInFormComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<SignInFormComponent>;
    let component: SignInFormComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SignInFormComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SignInFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-sign-in-form-standard by default', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-sign-in-form-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate mode/disabled/options/class', () => {
      fixture.componentRef.setInput('mode', 'sign-up');
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('options', { layout: 'card' });
      fixture.componentRef.setInput('class', 'wrapper-class');
      fixture.detectChanges();

      expect(component.mode()).toBe('sign-up');
      expect(component.disabled()).toBe(true);
      expect(component.options()).toEqual({ layout: 'card' });
      expect(component.cssClass()).toBe('wrapper-class');
    });
  });

  describe('with SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<SignInFormComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SignInFormComponent, MockInjectedComponent],
        providers: [
          {
            provide: SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SignInFormComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-sign-in-form',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-sign-in-form-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-sign-in-form-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
