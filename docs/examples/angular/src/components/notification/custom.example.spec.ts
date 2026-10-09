import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NotificationComponent } from '@smartsoft001/angular';

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

  it('should emit actionClick from the custom notification and through the wrapper', () => {
    // Arrange
    const notification: CustomNotificationComponent =
      fixture.debugElement.query(
        By.directive(CustomNotificationComponent),
      ).componentInstance;
    const wrapper: NotificationComponent = fixture.debugElement.query(
      By.directive(NotificationComponent),
    ).componentInstance;
    const emitted: string[] = [];
    const forwarded: string[] = [];
    notification.actionClick.subscribe(({ actionId }) =>
      emitted.push(actionId),
    );
    wrapper.actionClick.subscribe(({ actionId }) => forwarded.push(actionId));

    // Act
    element
      .querySelectorAll<HTMLButtonElement>('.docs-notification__action')[1]
      .click();

    // Assert
    expect(emitted).toEqual(['allow']);
    expect(forwarded).toEqual(['allow']);
  });

  it('should emit dismissed from the custom notification and through the wrapper', () => {
    // Arrange
    const wrapper: NotificationComponent = fixture.debugElement.query(
      By.directive(NotificationComponent),
    ).componentInstance;
    let dismissals = 0;
    wrapper.dismissed.subscribe(() => (dismissals += 1));

    // Act
    element
      .querySelector<HTMLButtonElement>('.docs-notification__dismiss')
      ?.click();

    // Assert
    expect(dismissals).toBe(1);
  });
});
