import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBaseComponent } from './base/base.component';
import { NotificationComponent } from './notification.component';
import { NOTIFICATION_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-notification-injected',
  template: '<div class="injected-notification">injected</div>',
})
class MockInjectedComponent extends NotificationBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: NotificationComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<NotificationComponent>;
    let component: NotificationComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NotificationComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(NotificationComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('title', 'X');
      fixture.detectChanges();
    });

    it('should render smart-notification-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-notification-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate title input to standard component', () => {
      expect(component.title()).toBe('X');
    });

    it('should propagate description input', () => {
      fixture.componentRef.setInput('description', 'desc');
      fixture.detectChanges();

      expect(component.description()).toBe('desc');
    });

    it('should propagate dismissible input', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      expect(component.dismissible()).toBe(true);
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { ariaLive: 'assertive' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ ariaLive: 'assertive' });
    });

    it('should propagate actions input', () => {
      fixture.componentRef.setInput('actions', [{ id: 'a', label: 'A' }]);
      fixture.detectChanges();

      expect(component.actions()).toEqual([{ id: 'a', label: 'A' }]);
    });
  });

  describe('with NOTIFICATION_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<NotificationComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NotificationComponent, MockInjectedComponent],
        providers: [
          {
            provide: NOTIFICATION_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NotificationComponent);
      fixture.componentRef.setInput('title', 'X');
      fixture.detectChanges();
    });

    it('should render injected component when NOTIFICATION_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-notification',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-notification-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-notification-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
