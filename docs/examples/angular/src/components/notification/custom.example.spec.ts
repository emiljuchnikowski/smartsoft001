import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CustomNotificationComponent,
  NotificationCustomExampleComponent,
} from './custom.example';

describe('docs-examples-angular: NotificationCustomExampleComponent', () => {
  let fixture: ComponentFixture<NotificationCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom notification through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-notification docs-custom-notification'),
    ).toBeTruthy();
    expect(element.querySelector('smart-notification-standard')).toBeNull();
  });

  it('should render the forwarded title and description', () => {
    expect(
      element.querySelector('.docs-notification__title')?.textContent,
    ).toContain('App notifications');
    expect(
      element.querySelector('.docs-notification__description')?.textContent,
    ).toContain('alerts, sounds and icon badges');
  });

  it('should render one button per forwarded action', () => {
    const actions = element.querySelectorAll('.docs-notification__action');

    expect(actions).toHaveLength(2);
    expect(actions[1].textContent).toContain('Allow');
  });

  // NgComponentOutlet does not forward outputs, so the wrapper's (actionClick)
  // never fires - the emission is asserted on the custom instance itself.
  it('should emit actionClick with the action id when an action is clicked', () => {
    const notification: CustomNotificationComponent =
      fixture.debugElement.query(
        By.directive(CustomNotificationComponent),
      ).componentInstance;
    const emitted: string[] = [];
    notification.actionClick.subscribe(({ actionId }) =>
      emitted.push(actionId),
    );

    element
      .querySelectorAll<HTMLButtonElement>('.docs-notification__action')[1]
      .click();

    expect(emitted).toEqual(['allow']);
  });

  it('should emit dismissed when the custom close button is clicked', () => {
    const notification: CustomNotificationComponent =
      fixture.debugElement.query(
        By.directive(CustomNotificationComponent),
      ).componentInstance;
    let dismissals = 0;
    notification.dismissed.subscribe(() => (dismissals += 1));

    element
      .querySelector<HTMLButtonElement>('.docs-notification__dismiss')
      ?.click();

    expect(dismissals).toBe(1);
  });
});
