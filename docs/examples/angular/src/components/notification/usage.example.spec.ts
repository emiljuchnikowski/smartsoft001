import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: NotificationUsageExampleComponent', () => {
  let fixture: ComponentFixture<NotificationUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should render the notification from the inputs and options', () => {
    const status = element.querySelector('[role="status"]');

    expect(status?.textContent).toContain('Successfully saved!');
    expect(status?.textContent).toContain('Anyone with a link can now view');
    expect(status?.getAttribute('aria-live')).toBe('polite');
  });

  it('should hand the clicked action id to the handler', () => {
    const undo = Array.from(
      element.querySelectorAll<HTMLButtonElement>('button[data-variant]'),
    ).find((button) => button.textContent?.includes('Undo'));

    undo?.click();

    expect(fixture.componentInstance.lastAction()).toBe('undo');
  });

  it('should hide the notification when it is dismissed', () => {
    element.querySelector<HTMLButtonElement>('[aria-label="Close"]')?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.visible()).toBe(false);
    expect(element.querySelector('[role="status"]')).toBeNull();
  });
});
