import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TogglePresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: TogglePresetComponent', () => {
  let fixture: ComponentFixture<TogglePresetComponent>;
  let component: TogglePresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TogglePresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TogglePresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function root(): HTMLElement {
    return fixture.nativeElement.querySelector('div');
  }

  function input(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[type="checkbox"]');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(TogglePresetComponent);
  });

  it('should render an accessible hidden checkbox with track and thumb', () => {
    expect(input()).toBeTruthy();
    expect(input().className).toContain('smart:peer');
    expect(input().className).toContain('smart:sr-only');
    expect(root().querySelectorAll('label span').length).toBe(2);
  });

  it('should reflect the unchecked state by default', () => {
    expect(input().checked).toBe(false);
    expect(component.value()).toBe(false);
  });

  it('should reflect the value input as the checked state', () => {
    fixture.componentRef.setInput('value', true);
    fixture.detectChanges();

    expect(input().checked).toBe(true);
  });

  it('should update value when the checkbox changes', () => {
    input().checked = true;
    input().dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.value()).toBe(true);
  });

  it('should disable the checkbox when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(input().disabled).toBe(true);
  });

  it('should apply the checked track color class', () => {
    const track = root().querySelectorAll('label span')[0];

    expect(track.className).toContain('smart:peer-checked:bg-blue-600');
  });

  it('should not render label text by default', () => {
    expect(root().textContent?.trim()).toBe('');
  });

  it('should render label and description from options', () => {
    fixture.componentRef.setInput('options', {
      label: 'Notifications',
      description: 'Enable push alerts',
    });
    fixture.detectChanges();

    expect(root().textContent).toContain('Notifications');
    expect(root().textContent).toContain('Enable push alerts');
  });

  it('should place the text before the switch when labelPosition is left', () => {
    fixture.componentRef.setInput('options', {
      label: 'Left label',
      labelPosition: 'left',
    });
    fixture.detectChanges();

    const children = Array.from(root().children);
    const labelIndex = children.findIndex((c) => c.tagName === 'SPAN');
    const switchIndex = children.findIndex((c) => c.tagName === 'LABEL');

    expect(labelIndex).toBeGreaterThanOrEqual(0);
    expect(labelIndex).toBeLessThan(switchIndex);
  });

  it('should forward options.ariaLabel to the checkbox', () => {
    fixture.componentRef.setInput('options', { ariaLabel: 'Toggle dark mode' });
    fixture.detectChanges();

    expect(input().getAttribute('aria-label')).toBe('Toggle dark mode');
  });

  it('should apply cssClass on the root element (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(root().className).toContain('my-extra-class');
  });
});
