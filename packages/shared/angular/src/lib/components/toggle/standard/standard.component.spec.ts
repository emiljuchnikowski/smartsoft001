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
});
