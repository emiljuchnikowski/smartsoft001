import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerPresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: DividerPresetComponent', () => {
  let fixture: ComponentFixture<DividerPresetComponent>;
  let component: DividerPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividerPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DividerPresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function host(): HTMLElement {
    return fixture.nativeElement.querySelector('[role="separator"]');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(DividerPresetComponent);
  });

  it('should render a plain hr when no content is provided', () => {
    const hr = fixture.nativeElement.querySelector('hr');

    expect(hr).toBeTruthy();
    expect(hr.className).toContain('smart:border-gray-200');
    expect(hr.className).toContain('smart:dark:border-neutral-700');
  });

  it('should render an inline label divider', () => {
    fixture.componentRef.setInput('label', 'Continue with');
    fixture.detectChanges();

    expect(host().textContent?.trim()).toContain('Continue with');
    expect(host().className).toContain('smart:text-gray-800');
  });

  it('should draw both connecting lines for the default center position', () => {
    fixture.componentRef.setInput('label', 'Or');
    fixture.detectChanges();

    const cls = host().className;

    expect(cls).toContain('smart:before:flex-1');
    expect(cls).toContain('smart:after:flex-1');
  });

  it('should draw only the trailing line for left position', () => {
    fixture.componentRef.setInput('label', 'Left');
    fixture.componentRef.setInput('options', { position: 'left' });
    fixture.detectChanges();

    const cls = host().className;

    expect(cls).toContain('smart:after:flex-1');
    expect(cls).not.toContain('smart:before:flex-1');
  });

  it('should draw only the leading line for right position', () => {
    fixture.componentRef.setInput('label', 'Right');
    fixture.componentRef.setInput('options', { position: 'right' });
    fixture.detectChanges();

    const cls = host().className;

    expect(cls).toContain('smart:before:flex-1');
    expect(cls).not.toContain('smart:after:flex-1');
  });

  it('should apply the uppercase muted treatment for the title variant', () => {
    fixture.componentRef.setInput('title', 'Or');
    fixture.componentRef.setInput('options', { variant: 'with-title' });
    fixture.detectChanges();

    const cls = host().className;

    expect(host().textContent?.trim()).toContain('Or');
    expect(cls).toContain('smart:uppercase');
    expect(cls).toContain('smart:text-gray-600');
  });

  it('should render an icon slot for the icon variant', () => {
    fixture.componentRef.setInput('iconName', 'star');
    fixture.componentRef.setInput('options', { variant: 'with-icon' });
    fixture.detectChanges();

    const icon = host().querySelector('span');

    expect(icon).toBeTruthy();
    expect(icon?.className).toContain('smart:size-4');
    expect(icon?.textContent?.trim()).toBe('star');
  });

  it('should render an action button for the button variant', () => {
    fixture.componentRef.setInput('actionLabel', 'Add item');
    fixture.detectChanges();

    const button = host().querySelector('button');

    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toContain('Add item');
    expect(button?.className).toContain('smart:rounded-lg');
  });

  it('should emit actionClick when the action button is clicked', () => {
    fixture.componentRef.setInput('actionLabel', 'Add item');
    fixture.detectChanges();

    let emitted = false;
    component.actionClick.subscribe(() => (emitted = true));

    host().querySelector<HTMLButtonElement>('button')?.click();

    expect(emitted).toBe(true);
  });

  it('should render label, line and action for the toolbar variant', () => {
    fixture.componentRef.setInput('label', 'Tools');
    fixture.componentRef.setInput('actionLabel', 'Add');
    fixture.componentRef.setInput('options', { variant: 'with-toolbar' });
    fixture.detectChanges();

    expect(host().textContent).toContain('Tools');
    expect(host().textContent).toContain('Add');
    expect(host().querySelector('button')).toBeTruthy();
    expect(host().className).toContain('smart:gap-x-4');
  });

  it('should apply cssClass on the host (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('label', 'Or');
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(host().className).toContain('my-extra-class');
  });
});
