import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { DateEditComponent } from './date-edit.component';
import { DateEditStandardComponent } from './standard/standard.component';

describe('DateEditStandardComponent', () => {
  let fixture: ComponentFixture<DateEditStandardComponent>;
  let component: DateEditStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateEditStandardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DateEditStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render 8 input fields', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(8);
  });

  it('should render 2 separator dashes', () => {
    const separators = fixture.nativeElement.querySelectorAll('span');
    const dashes = Array.from(separators).filter(
      (el: any) => el.textContent.trim() === '-',
    );
    expect(dashes.length).toBe(2);
  });

  it('should render DD, MM, RRRR labels', () => {
    const labels = fixture.nativeElement.querySelectorAll('span');
    const texts = Array.from(labels).map((el: any) => el.textContent.trim());
    expect(texts).toContain('DD');
    expect(texts).toContain('MM');
    expect(texts).toContain('RRRR');
  });

  it('should have Tailwind classes on inputs', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.classList.contains('smart:w-8')).toBe(true);
    expect(input.classList.contains('smart:h-10')).toBe(true);
    expect(input.classList.contains('smart:text-center')).toBe(true);
    expect(input.classList.contains('smart:border')).toBe(true);
    expect(input.classList.contains('smart:rounded-md')).toBe(true);
  });

  it('should have dark mode classes on inputs', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.classList.contains('smart:dark:bg-gray-800')).toBe(true);
    expect(input.classList.contains('smart:dark:text-white')).toBe(true);
  });

  it('should apply invalid classes when date is invalid', () => {
    component.validDate = false;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.classList.contains('smart:border-red-500')).toBe(true);
  });
});

describe('@smartsoft001/angular: DateEditComponent', () => {
  @Component({
    imports: [DateEditComponent],
    template: `<smart-date-edit
      [variant]="variant"
      [(ngModel)]="value"
    ></smart-date-edit>`,
  })
  class BoundHostComponent {
    variant: 'standard' | 'preset' = 'preset';
    value = '2026-04-07';
  }

  @Component({
    imports: [DateEditComponent],
    template: `<smart-date-edit variant="preset"></smart-date-edit>`,
  })
  class UnboundHostComponent {}

  // The documented consumer usage: FormsModule in the *consumer's* component,
  // which makes the NgModel directive match <smart-date-edit> itself.
  @Component({
    imports: [DateEditComponent, FormsModule],
    template: `<smart-date-edit
      variant="preset"
      [(ngModel)]="value"
    ></smart-date-edit>`,
  })
  class NgModelHostComponent {
    value = '2026-04-07';
  }

  const trigger = (f: ComponentFixture<unknown>): HTMLInputElement =>
    f.nativeElement.querySelector('input[aria-label="Open date picker"]');

  it('should show the supplied value in the preset trigger', () => {
    // Arrange
    const fixture = TestBed.createComponent(BoundHostComponent);

    // Act
    fixture.detectChanges();

    // Assert
    expect(trigger(fixture).value).toBe('2026-04-07');
  });

  it('should keep the supplied value after the microtask queue drains', async () => {
    // Regression: FormsModule in the wrapper made the NgModel directive match
    // the inner variant element alongside its own ngModel model() input. Its
    // setUpControl() wrote the fresh FormControl's null through writeValue(),
    // the model() output echoed that null up through (ngModelChange), and the
    // value was lost — but only after the deferred NgModel update resolved.
    // Arrange
    const fixture = TestBed.createComponent(BoundHostComponent);
    fixture.detectChanges();

    // Act
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    expect(trigger(fixture).value).toBe('2026-04-07');
    expect(fixture.componentInstance.value).toBe('2026-04-07');
  });

  it('should fall back to the default date when no value is bound', () => {
    // Arrange
    const fixture = TestBed.createComponent(UnboundHostComponent);

    // Act
    fixture.detectChanges();

    // Assert
    expect(trigger(fixture).value).toBe('2001-01-01');
  });

  it('should forward the supplied value to the standard variant inputs', async () => {
    // Arrange
    const fixture = TestBed.createComponent(BoundHostComponent);
    fixture.componentInstance.variant = 'standard';

    // Act — the standard variant drives its digit boxes through NgModel, which
    // writes into the DOM on the microtask queue.
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert — 8 single-digit boxes spelling DD-MM-RRRR of 2026-04-07
    const digits = Array.from<HTMLInputElement>(
      fixture.nativeElement.querySelectorAll('input'),
    ).map((input) => input.value);
    expect(digits).toEqual(['0', '7', '0', '4', '2', '0', '2', '6']);
  });

  it('should keep the value when the consumer drives it through FormsModule', async () => {
    // Arrange
    const fixture = TestBed.createComponent(NgModelHostComponent);

    // Act — NgModel seeds the control with null before writing the real value
    // on the microtask queue, so both passes have to settle on the value.
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    expect(trigger(fixture).value).toBe('2026-04-07');
    expect(fixture.componentInstance.value).toBe('2026-04-07');
  });

  it('should propagate a picked day back to the two-way binding', () => {
    // Arrange
    const fixture = TestBed.createComponent(BoundHostComponent);
    fixture.detectChanges();
    trigger(fixture).click();
    fixture.detectChanges();

    // Act — pick the 22nd of the displayed month (April 2026)
    const day = Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('button[data-role="day"]'),
    ).find((button) => button.textContent?.trim() === '22');
    day?.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.value).toBe('2026-04-22');
    expect(trigger(fixture).value).toBe('2026-04-22');
  });
});
