import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBaseComponent } from './base.component';
import { INotificationAction, INotificationOptions } from '../../../models';

@Component({
  selector: 'smart-test-notification',
  template: '',
})
class TestNotificationComponent extends NotificationBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-notification
    [title]="title"
    [description]="description"
    [iconName]="iconName"
    [avatarUrl]="avatarUrl"
    [actions]="actions"
    [dismissible]="dismissible"
    [options]="options"
    [class]="cssClass"
    (dismissed)="onDismissed()"
    (actionClick)="onActionClick($event)"
  />`,
  imports: [TestNotificationComponent],
})
class TestHostComponent {
  title = 'Heads up';
  description: string | undefined = undefined;
  iconName: string | undefined = undefined;
  avatarUrl: string | undefined = undefined;
  actions: INotificationAction[] = [];
  dismissible = false;
  options: INotificationOptions | undefined = undefined;
  cssClass = '';

  dismissedCount = 0;
  lastActionEvent: { actionId: string } | undefined = undefined;

  onDismissed(): void {
    this.dismissedCount += 1;
  }

  onActionClick(event: { actionId: string }): void {
    this.lastActionEvent = event;
  }
}

describe('@smartsoft001/shared-angular: NotificationBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestNotificationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(directive).toBeInstanceOf(NotificationBaseComponent);
  });

  it('should have smartType static equal to "notification"', () => {
    expect(NotificationBaseComponent.smartType).toBe('notification');
  });

  it('should default actions to an empty array', () => {
    expect(directive.actions()).toEqual([]);
  });

  it('should default dismissible to false', () => {
    expect(directive.dismissible()).toBe(false);
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should accept INotificationOptions via options input', async () => {
    host.options = { ariaLive: 'assertive', variant: 'with-actions-below' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      ariaLive: 'assertive',
      variant: 'with-actions-below',
    });
  });

  it('should emit dismissed when dismiss() is called', () => {
    directive.dismiss();

    expect(host.dismissedCount).toBe(1);
  });

  it('should emit actionClick with the action id when invokeAction() is called', () => {
    directive.invokeAction('confirm');

    expect(host.lastActionEvent).toEqual({ actionId: 'confirm' });
  });
});
