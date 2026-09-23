import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';
import { AlertBaseComponent } from './base/base.component';
import { ALERT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-alert-injected',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div class="injected-alert">injected</div>',
})
class MockInjectedComponent extends AlertBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: AlertComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<AlertComponent>;
    let component: AlertComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AlertComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(AlertComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('options', { header: 'Confirm' });
      fixture.detectChanges();
    });

    it('should render smart-alert-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-alert-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate options input', () => {
      expect(component.options()).toEqual({ header: 'Confirm' });
    });

    it('should default cssClass to empty string', () => {
      expect(component.cssClass()).toBe('');
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should forward dismissed from the standard component', () => {
      const spy = jest.fn();
      fixture.componentRef.setInput('options', {
        buttons: [{ text: 'Confirm' }],
      });
      fixture.detectChanges();
      component.dismissed.subscribe(spy);

      fixture.nativeElement.querySelector('button').click();

      expect(spy).toHaveBeenCalledWith({ text: 'Confirm' });
    });
  });

  describe('with ALERT_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<AlertComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AlertComponent, MockInjectedComponent],
        providers: [
          {
            provide: ALERT_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AlertComponent);
      fixture.componentRef.setInput('options', { header: 'Confirm' });
      fixture.detectChanges();
    });

    it('should render injected component when token is provided', () => {
      const injected =
        fixture.nativeElement.querySelector('div.injected-alert');

      expect(injected).toBeTruthy();
    });

    it('should not render smart-alert-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-alert-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
