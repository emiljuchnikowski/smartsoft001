import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionPresetComponent } from './preset.component';
import { IAccordionOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <ng-template #headerTpl>Test Header</ng-template>
    <ng-template #bodyTpl>Test Body Content</ng-template>
    <smart-accordion-preset
      [headerTpl]="headerTpl"
      [bodyTpl]="bodyTpl"
      [(show)]="isOpen"
      [options]="options"
      [cssClass]="cssClass"
    />
  `,
  imports: [AccordionPresetComponent],
})
class TestHostComponent {
  isOpen = false;
  options: IAccordionOptions | undefined = undefined;
  cssClass = '';
}

describe('AccordionPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    // Arrange
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Assert
    expect(host).toBeTruthy();
    expect(element.querySelector('smart-accordion-preset')).toBeTruthy();
  });

  it('should render the bordered card container', () => {
    // Act
    const container = element.querySelector('smart-accordion-preset > div');

    // Assert
    expect(container).toBeTruthy();
    expect(container?.classList.contains('smart:rounded-xl')).toBe(true);
    expect(container?.classList.contains('smart:border')).toBe(true);
    expect(container?.classList.contains('smart:bg-white')).toBe(true);
  });

  it('should render the projected header content', () => {
    // Act
    const button = element.querySelector('button');

    // Assert
    expect(button?.textContent).toContain('Test Header');
  });

  it('should hide the body when closed', () => {
    // Assert
    expect(element.querySelector('[role="region"]')).toBeNull();
  });

  it('should show the body when opened via click', () => {
    // Act
    element.querySelector('button')?.click();
    fixture.detectChanges();

    // Assert
    const body = element.querySelector('[role="region"]');
    expect(body).toBeTruthy();
    expect(body?.textContent).toContain('Test Body Content');
  });

  it('should toggle the body on repeated clicks', () => {
    // Act / Assert
    const button = element.querySelector('button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    expect(element.querySelector('[role="region"]')).toBeTruthy();

    button.click();
    fixture.detectChanges();
    expect(element.querySelector('[role="region"]')).toBeNull();
  });

  it('should reflect the open state via aria-expanded', () => {
    // Act
    const button = element.querySelector('button') as HTMLButtonElement;

    // Assert
    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('should show the chevron-down icon when closed', () => {
    // Act
    const path = element.querySelector('button svg path');

    // Assert
    expect(path?.getAttribute('d')).toBe('m6 9 6 6 6-6');
  });

  it('should show the chevron-up icon when open', () => {
    // Act
    element.querySelector('button')?.click();
    fixture.detectChanges();
    const path = element.querySelector('button svg path');

    // Assert
    expect(path?.getAttribute('d')).toBe('m18 15-6-6-6 6');
  });

  it('should apply the active text colour when open', () => {
    // Act
    element.querySelector('button')?.click();
    fixture.detectChanges();
    const button = element.querySelector('button') as HTMLButtonElement;

    // Assert
    expect(button.classList.contains('smart:text-blue-600')).toBe(true);
  });

  it('should not toggle when disabled', () => {
    // Arrange — recreate the fixture and set the input before the first CD
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    host.options = { disabled: true };
    fixture.detectChanges();

    // Act
    const button = element.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    button.click();
    fixture.detectChanges();

    // Assert
    expect(element.querySelector('[role="region"]')).toBeNull();
    expect(host.isOpen).toBe(false);
  });

  it('should append the cssClass to the container', () => {
    // Arrange — recreate the fixture and set the input before the first CD
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    // Act
    const container = element.querySelector('smart-accordion-preset > div');

    // Assert
    expect(container?.classList.contains('my-custom-class')).toBe(true);
  });

  it('should update the two-way show binding on toggle', () => {
    // Act
    element.querySelector('button')?.click();
    fixture.detectChanges();

    // Assert
    expect(host.isOpen).toBe(true);
  });
});
