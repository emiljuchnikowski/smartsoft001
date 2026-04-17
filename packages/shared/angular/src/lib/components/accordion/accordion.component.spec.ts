import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionComponent } from './accordion.component';
import { AccordionBodyComponent } from './body/body.component';
import { AccordionHeaderComponent } from './header/header.component';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-accordion [(show)]="isOpen" [options]="options">
      <div accordionHeader>Test Header</div>
      <div accordionBody>Test Body Content</div>
    </smart-accordion>
  `,
  imports: [AccordionComponent],
})
class TestHostComponent {
  isOpen = false;
  options: any = undefined;
}

describe('AccordionComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the accordion container with border classes', () => {
    const container = fixture.nativeElement.querySelector(
      'smart-accordion div',
    );
    expect(container.classList.contains('smart:rounded-lg')).toBe(true);
    expect(container.classList.contains('smart:border')).toBe(true);
    expect(container.classList.contains('smart:border-gray-200')).toBe(true);
  });

  it('should render header content', () => {
    const header = fixture.nativeElement.querySelector('[accordionHeader]');
    expect(header.textContent).toContain('Test Header');
  });

  it('should hide body when closed', () => {
    const body = fixture.nativeElement.querySelector('[accordionBody]');
    expect(body).toBeNull();
  });

  it('should show body when open', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector('[accordionBody]');
    expect(body).toBeTruthy();
    expect(body.textContent).toContain('Test Body Content');
  });

  it('should toggle body on header click', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[accordionBody]')).toBeTruthy();

    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[accordionBody]')).toBeNull();
  });

  it('should not toggle when disabled', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.options = { disabled: true };
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[accordionBody]')).toBeNull();
  });

  it('should show chevron-down icon when closed', () => {
    const svg = fixture.nativeElement.querySelector('smart-icon svg');
    expect(svg).toBeTruthy();
  });

  it('should update two-way binding on toggle', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(host.isOpen).toBe(true);
  });
});

describe('AccordionHeaderComponent', () => {
  let fixture: ComponentFixture<AccordionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionHeaderComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AccordionHeaderComponent);
  });

  it('should render a button with Tailwind classes', () => {
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn.classList.contains('smart:flex')).toBe(true);
    expect(btn.classList.contains('smart:w-full')).toBe(true);
    expect(btn.classList.contains('smart:font-medium')).toBe(true);
  });

  it('should show chevron-down when not open', () => {
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('smart-icon svg path');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('d')).toContain('5.22 8.22');
  });

  it('should show chevron-up when open', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('smart-icon svg path');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('d')).toContain('14.78 11.78');
  });

  it('should apply disabled classes when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:opacity-50')).toBe(true);
    expect(btn.classList.contains('smart:cursor-not-allowed')).toBe(true);
    expect(btn.disabled).toBe(true);
  });
});

describe('AccordionBodyComponent', () => {
  let fixture: ComponentFixture<AccordionBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionBodyComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AccordionBodyComponent);
  });

  it('should render body with Tailwind classes', () => {
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelector('div');
    expect(div).toBeTruthy();
    expect(div.classList.contains('smart:px-4')).toBe(true);
    expect(div.classList.contains('smart:py-3')).toBe(true);
    expect(div.classList.contains('smart:text-gray-600')).toBe(true);
  });
});
