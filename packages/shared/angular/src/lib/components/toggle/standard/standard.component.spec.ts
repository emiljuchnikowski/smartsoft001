import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleStandardComponent } from './standard.component';

describe('@smartsoft001/shared-angular: ToggleStandardComponent', () => {
  let fixture: ComponentFixture<ToggleStandardComponent>;
  let component: ToggleStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render an <input type="checkbox"> element', () => {
    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(input).toBeTruthy();
  });

  it('should reflect value() in the input checked attribute', () => {
    fixture.componentRef.setInput('value', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(input.checked).toBe(true);
  });

  it('should default value to false (input unchecked)', () => {
    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(input.checked).toBe(false);
  });

  it('should propagate disabled to the input element', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(input.disabled).toBe(true);
  });

  it('should update value() when the input change event fires', () => {
    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.value()).toBe(true);
  });

  it('should set aria-label from options when provided', () => {
    fixture.componentRef.setInput('options', { ariaLabel: 'Use setting' });
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(input.getAttribute('aria-label')).toBe('Use setting');
  });

  it('should include external cssClass on the input when provided', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(input.className).toContain('my-extra-class');
  });
  describe('label / description / labelPosition', () => {
    it('should render options.label in a <label> associated with the input', () => {
      fixture.componentRef.setInput('options', { label: 'Notifications' });
      fixture.detectChanges();

      const input: HTMLInputElement = fixture.nativeElement.querySelector(
        'input[type="checkbox"]',
      );
      const label: HTMLLabelElement =
        fixture.nativeElement.querySelector('label');

      expect(label.textContent?.trim()).toBe('Notifications');
      expect(label.control).toBe(input);
    });

    it('should not render a <label> when options.label is absent', () => {
      fixture.componentRef.setInput('options', { ariaLabel: 'Use setting' });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('label');

      expect(label).toBeNull();
    });

    it('should drop aria-label when a visible label is rendered', () => {
      fixture.componentRef.setInput('options', {
        label: 'Notifications',
        ariaLabel: 'Use setting',
      });
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector(
        'input[type="checkbox"]',
      );

      expect(input.hasAttribute('aria-label')).toBe(false);
    });

    it('should render the description referenced by aria-describedby', () => {
      fixture.componentRef.setInput('options', {
        label: 'Notifications',
        description: 'Get notified about updates.',
      });
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector(
        'input[type="checkbox"]',
      );
      const describedBy = input.getAttribute('aria-describedby');
      const description = fixture.nativeElement.querySelector(
        `#${describedBy}`,
      );

      expect(description.textContent.trim()).toBe(
        'Get notified about updates.',
      );
    });

    it('should not set aria-describedby without a description', () => {
      fixture.componentRef.setInput('options', { label: 'Notifications' });
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector(
        'input[type="checkbox"]',
      );

      expect(input.hasAttribute('aria-describedby')).toBe(false);
    });

    it('should place the text after the switch by default (right)', () => {
      fixture.componentRef.setInput('options', { label: 'Notifications' });
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector(
        'input[type="checkbox"]',
      );
      const text = fixture.nativeElement.querySelector('[data-role="text"]');

      expect(
        input.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it('should place the text before the switch when labelPosition is left', () => {
      fixture.componentRef.setInput('options', {
        label: 'Notifications',
        labelPosition: 'left',
      });
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector(
        'input[type="checkbox"]',
      );
      const text = fixture.nativeElement.querySelector('[data-role="text"]');

      expect(
        input.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_PRECEDING,
      ).toBeTruthy();
    });

    it('should give each instance a unique input id', () => {
      const other = TestBed.createComponent(ToggleStandardComponent);
      fixture.componentRef.setInput('options', { label: 'A' });
      other.componentRef.setInput('options', { label: 'B' });
      fixture.detectChanges();
      other.detectChanges();

      const firstId = fixture.nativeElement.querySelector('input').id;
      const secondId = other.nativeElement.querySelector('input').id;

      expect(firstId).toBeTruthy();
      expect(firstId).not.toBe(secondId);
    });
  });
});
