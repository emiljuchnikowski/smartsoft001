import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: NotificationPresetComponent', () => {
  let fixture: ComponentFixture<NotificationPresetComponent>;
  let component: NotificationPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'This is a normal message.');
    fixture.detectChanges();
  });

  function root(): HTMLElement {
    return fixture.nativeElement.querySelector('[role="alert"]');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(NotificationPresetComponent);
  });

  it('should render the title and the card container classes', () => {
    expect(root().textContent?.trim()).toContain('This is a normal message.');
    expect(root().className).toContain('smart:rounded-xl');
    expect(root().className).toContain('smart:shadow-lg');
  });

  it('should default to the simple variant (message paragraph)', () => {
    const paragraph = root().querySelector('p');

    expect(paragraph?.textContent?.trim()).toBe('This is a normal message.');
    expect(paragraph?.className).toContain('smart:text-gray-800');
  });

  it('should reflect the aria-live option', () => {
    expect(root().getAttribute('aria-live')).toBe('polite');

    fixture.componentRef.setInput('options', { ariaLive: 'assertive' });
    fixture.detectChanges();

    expect(root().getAttribute('aria-live')).toBe('assertive');
  });

  it('should render the icon glyph when iconName is set', () => {
    fixture.componentRef.setInput('iconName', '✓');
    fixture.detectChanges();

    expect(root().querySelector('span')?.textContent?.trim()).toBe('✓');
  });

  it('should render a heading and description for the with-actions-below variant', () => {
    fixture.componentRef.setInput('title', 'App notifications');
    fixture.componentRef.setInput(
      'description',
      'Notifications may include alerts.',
    );
    fixture.componentRef.setInput('options', { variant: 'with-actions-below' });
    fixture.detectChanges();

    expect(root().querySelector('h3')?.textContent?.trim()).toBe(
      'App notifications',
    );
    expect(root().textContent).toContain('Notifications may include alerts.');
  });

  it('should render the avatar image for the with-avatar variant', () => {
    fixture.componentRef.setInput('avatarUrl', 'https://example.com/a.png');
    fixture.componentRef.setInput('options', { variant: 'with-avatar' });
    fixture.detectChanges();

    const img = root().querySelector<HTMLImageElement>('img');

    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/a.png');
  });

  it('should render link-styled actions and emit actionClick', () => {
    fixture.componentRef.setInput('options', { variant: 'with-actions-below' });
    fixture.componentRef.setInput('actions', [{ id: 'allow', label: 'Allow' }]);
    fixture.detectChanges();

    let emitted: { actionId: string } | undefined;
    component.actionClick.subscribe((e) => (emitted = e));

    const button = root().querySelector<HTMLButtonElement>('button');
    expect(button?.className).toContain('smart:hover:underline');

    button?.click();

    expect(emitted).toEqual({ actionId: 'allow' });
  });

  it('should render button-styled actions for the with-buttons-below variant', () => {
    fixture.componentRef.setInput('options', { variant: 'with-buttons-below' });
    fixture.componentRef.setInput('actions', [
      { id: 'ok', label: 'OK', variant: 'primary' },
    ]);
    fixture.detectChanges();

    const button = root().querySelector<HTMLButtonElement>('button');

    expect(button?.className).toContain('smart:rounded-lg');
    expect(button?.className).toContain('smart:bg-blue-600');
  });

  it('should grow split buttons for the with-split-buttons variant', () => {
    fixture.componentRef.setInput('options', { variant: 'with-split-buttons' });
    fixture.componentRef.setInput('actions', [{ id: 'a', label: 'A' }]);
    fixture.detectChanges();

    const button = root().querySelector<HTMLButtonElement>('button');

    expect(button?.className).toContain('smart:grow');
  });

  it('should render a close button and emit dismissed when dismissible', () => {
    fixture.componentRef.setInput('options', { variant: 'condensed' });
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    let emitted = false;
    component.dismissed.subscribe(() => (emitted = true));

    root()
      .querySelector<HTMLButtonElement>('button[aria-label="Close"]')
      ?.click();

    expect(emitted).toBe(true);
  });

  it('should apply cssClass on the host (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(root().className).toContain('my-extra-class');
  });
});
