import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationStandardComponent } from './standard.component';

describe('@smartsoft001/shared-angular: NotificationStandardComponent', () => {
  let fixture: ComponentFixture<NotificationStandardComponent>;
  let component: NotificationStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationStandardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Heads up');
    fixture.detectChanges();
  });

  it('should render a container with role="status"', () => {
    const container = fixture.nativeElement.querySelector('[role="status"]');

    expect(container).toBeTruthy();
  });

  it('should default aria-live to "polite" when no options are provided', () => {
    const container = fixture.nativeElement.querySelector('[role="status"]');

    expect(container.getAttribute('aria-live')).toBe('polite');
  });

  it('should override aria-live via options.ariaLive', () => {
    fixture.componentRef.setInput('options', { ariaLive: 'assertive' });
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="status"]');

    expect(container.getAttribute('aria-live')).toBe('assertive');
  });

  it('should render the title inside an <h3>', () => {
    const heading = fixture.nativeElement.querySelector('h3');

    expect(heading.textContent.trim()).toBe('Heads up');
  });

  it('should not render a <p> when description is not provided', () => {
    const paragraph = fixture.nativeElement.querySelector('p');

    expect(paragraph).toBeNull();
  });

  it('should render description inside a <p> when provided', () => {
    fixture.componentRef.setInput('description', 'More info here');
    fixture.detectChanges();

    const paragraph = fixture.nativeElement.querySelector('p');

    expect(paragraph.textContent.trim()).toBe('More info here');
  });

  it('should not render the dismiss button when dismissible is false', () => {
    const dismissBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Close"]',
    );

    expect(dismissBtn).toBeNull();
  });

  it('should render the dismiss button when dismissible is true', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    const dismissBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Close"]',
    );

    expect(dismissBtn).toBeTruthy();
  });

  it('should emit dismissed when dismiss button is clicked', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    let emitted = 0;
    component.dismissed.subscribe(() => (emitted += 1));

    const dismissBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Close"]',
    );
    dismissBtn.click();

    expect(emitted).toBe(1);
  });

  it('should render an action button for each provided action', () => {
    fixture.componentRef.setInput('actions', [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ]);
    fixture.detectChanges();

    const actionButtons = fixture.nativeElement.querySelectorAll(
      'button[data-variant]',
    );

    expect(actionButtons.length).toBe(2);
    expect(actionButtons[0].textContent.trim()).toBe('A');
    expect(actionButtons[1].textContent.trim()).toBe('B');
  });

  it('should default action data-variant to "primary" when variant is not provided', () => {
    fixture.componentRef.setInput('actions', [{ id: 'a', label: 'A' }]);
    fixture.detectChanges();

    const actionBtn = fixture.nativeElement.querySelector(
      'button[data-variant]',
    );

    expect(actionBtn.getAttribute('data-variant')).toBe('primary');
  });

  it('should reflect the action variant on data-variant attribute', () => {
    fixture.componentRef.setInput('actions', [
      { id: 'a', label: 'A', variant: 'secondary' },
    ]);
    fixture.detectChanges();

    const actionBtn = fixture.nativeElement.querySelector(
      'button[data-variant]',
    );

    expect(actionBtn.getAttribute('data-variant')).toBe('secondary');
  });

  it('should emit actionClick with the corresponding action id when an action button is clicked', () => {
    fixture.componentRef.setInput('actions', [
      { id: 'confirm', label: 'Confirm' },
    ]);
    fixture.detectChanges();

    let received: { actionId: string } | undefined;
    component.actionClick.subscribe((event) => (received = event));

    const actionBtn = fixture.nativeElement.querySelector(
      'button[data-variant]',
    );
    actionBtn.click();

    expect(received).toEqual({ actionId: 'confirm' });
  });

  it('should apply external cssClass to the container when provided', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="status"]');

    expect(container.className).toContain('my-extra-class');
  });
});
