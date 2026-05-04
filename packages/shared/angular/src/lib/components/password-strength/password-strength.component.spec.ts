import { Component, Pipe, PipeTransform, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';

import { PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { PasswordStrengthBaseComponent } from './base/base.component';
import { PasswordStrengthComponent } from './password-strength.component';
import { PasswordStrengthStandardComponent } from './standard/standard.component';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Component({
  selector: 'smart-test-injected-password-strength',
  template: '<div class="injected-ps">injected</div>',
})
class MockInjectedPasswordStrengthComponent extends PasswordStrengthBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: PasswordStrengthComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<PasswordStrengthComponent>;
    let component: PasswordStrengthComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PasswordStrengthComponent],
      })
        .overrideComponent(PasswordStrengthStandardComponent, {
          remove: { imports: [TranslatePipe] },
          add: { imports: [MockTranslatePipe] },
        })
        .compileComponents();

      fixture = TestBed.createComponent(PasswordStrengthComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('passwordToCheck', '');
      fixture.componentRef.setInput('showHint', false);
      fixture.detectChanges();
    });

    it('should render smart-password-strength-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-password-strength-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate passwordToCheck input to the standard component', () => {
      fixture.componentRef.setInput('passwordToCheck', 'Abcdefg1!');
      fixture.detectChanges();

      const standardInstance = fixture.debugElement.query(
        By.directive(PasswordStrengthStandardComponent),
      ).componentInstance;

      expect(standardInstance.passwordToCheck()).toBe('Abcdefg1!');
    });

    it('should propagate showHint=true to the standard component', () => {
      fixture.componentRef.setInput('showHint', true);
      fixture.detectChanges();

      const lists = fixture.nativeElement.querySelectorAll(
        'smart-password-strength-standard ul',
      );

      expect(lists.length).toBe(2);
    });

    it('should propagate cssClass via class alias to the standard component', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(
        'smart-password-strength-standard > div',
      );

      expect(component.cssClass()).toBe('passed-class');
      expect(container!.getAttribute('class')).toContain('passed-class');
    });

    it('should forward the passwordStrength output when strong password is provided', () => {
      const emissions: boolean[] = [];
      component.passwordStrength.subscribe((v) => emissions.push(v));

      fixture.componentRef.setInput('passwordToCheck', 'Abcdefg1!');
      fixture.detectChanges();

      expect(emissions).toContain(true);
    });
  });

  describe('with PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<PasswordStrengthComponent>;
    let component: PasswordStrengthComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          PasswordStrengthComponent,
          MockInjectedPasswordStrengthComponent,
        ],
        providers: [
          {
            provide: PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedPasswordStrengthComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PasswordStrengthComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('passwordToCheck', '');
      fixture.componentRef.setInput('showHint', false);
      fixture.detectChanges();
    });

    it('should render the injected component when PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector('div.injected-ps');

      expect(injected).toBeTruthy();
    });

    it('should forward passwordStrength output from the injected component to the wrapper output', () => {
      const emissions: boolean[] = [];
      component.passwordStrength.subscribe((v) => emissions.push(v));

      fixture.componentRef.setInput('passwordToCheck', 'Abcdefg1!');
      fixture.detectChanges();

      expect(emissions).toContain(true);
    });
  });
});
