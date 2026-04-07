import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { ICardOptions } from '../../models';

@Component({
  selector: 'smart-test-card-host',
  template: `
    <smart-card
      [options]="options"
      [hasHeader]="hasHeader"
      [hasFooter]="hasFooter"
    >
      <div cardHeader>Header Content</div>
      Main Body Content
      <div cardFooter>Footer Content</div>
    </smart-card>
  `,
  imports: [CardComponent],
})
class TestHostComponent {
  options: ICardOptions | undefined = undefined;
  hasHeader = false;
  hasFooter = false;
}

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CardComponent);
  });

  it('should render basic card with default classes', () => {
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList.contains('smart:rounded-lg')).toBe(true);
    expect(container.classList.contains('smart:bg-white')).toBe(true);
    expect(container.classList.contains('smart:shadow-sm')).toBe(true);
    expect(container.classList.contains('smart:overflow-hidden')).toBe(true);
  });

  it('should apply edge-to-edge variant', () => {
    fixture.componentRef.setInput('options', {
      variant: 'edge-to-edge',
    } as ICardOptions);
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList.contains('sm:smart:rounded-lg')).toBe(true);
    expect(container.classList.contains('smart:rounded-lg')).toBe(false);
  });

  it('should apply well variant', () => {
    fixture.componentRef.setInput('options', {
      variant: 'well',
    } as ICardOptions);
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList.contains('smart:bg-gray-50')).toBe(true);
    expect(container.classList.contains('smart:shadow-sm')).toBe(false);
  });

  it('should apply well-on-gray variant', () => {
    fixture.componentRef.setInput('options', {
      variant: 'well-on-gray',
    } as ICardOptions);
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList.contains('smart:bg-gray-200')).toBe(true);
  });

  it('should apply well-edge-to-edge variant', () => {
    fixture.componentRef.setInput('options', {
      variant: 'well-edge-to-edge',
    } as ICardOptions);
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList.contains('smart:bg-gray-50')).toBe(true);
    expect(container.classList.contains('sm:smart:rounded-lg')).toBe(true);
    expect(container.classList.contains('smart:rounded-lg')).toBe(false);
  });

  it('should render body section with correct classes', () => {
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelectorAll('div')[1];
    expect(body.classList.contains('smart:px-4')).toBe(true);
    expect(body.classList.contains('smart:py-5')).toBe(true);
  });

  it('should apply gray body classes', () => {
    fixture.componentRef.setInput('options', {
      grayBody: true,
    } as ICardOptions);
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelectorAll('div')[1];
    expect(body.classList.contains('smart:bg-gray-50')).toBe(true);
  });

  it('should show title when provided', () => {
    fixture.componentRef.setInput('hasHeader', true);
    fixture.componentRef.setInput('options', {
      title: 'Test Title',
    } as ICardOptions);
    fixture.detectChanges();
    const h3 = fixture.nativeElement.querySelector('h3');
    expect(h3).toBeTruthy();
    expect(h3.textContent).toContain('Test Title');
  });

  it('should include dark mode classes', () => {
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('div');
    expect(container.classList.contains('dark:smart:bg-gray-800/50')).toBe(
      true,
    );
  });
});

describe('CardComponent with host', () => {
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

  it('should hide header when hasHeader is false', () => {
    const headerContent = fixture.nativeElement.querySelector('[cardHeader]');
    expect(headerContent).toBeNull();
  });

  it('should show header when hasHeader is true', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.hasHeader = true;
    fixture.detectChanges();
    const headerContent = fixture.nativeElement.querySelector('[cardHeader]');
    expect(headerContent).toBeTruthy();
    expect(headerContent.textContent).toContain('Header Content');
  });

  it('should hide footer when hasFooter is false', () => {
    const footerContent = fixture.nativeElement.querySelector('[cardFooter]');
    expect(footerContent).toBeNull();
  });

  it('should show footer when hasFooter is true', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.hasFooter = true;
    fixture.detectChanges();
    const footerContent = fixture.nativeElement.querySelector('[cardFooter]');
    expect(footerContent).toBeTruthy();
    expect(footerContent.textContent).toContain('Footer Content');
  });

  it('should apply divider classes when header is present', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.hasHeader = true;
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('smart-card > div');
    expect(container.classList.contains('smart:divide-y')).toBe(true);
    expect(container.classList.contains('smart:divide-gray-200')).toBe(true);
  });

  it('should apply gray footer classes', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.hasFooter = true;
    fixture.componentInstance.options = { grayFooter: true };
    fixture.detectChanges();
    const footerDiv =
      fixture.nativeElement.querySelector('[cardFooter]').parentElement;
    expect(footerDiv.classList.contains('smart:bg-gray-50')).toBe(true);
  });

  it('should render body content', () => {
    expect(fixture.nativeElement.textContent).toContain('Main Body Content');
  });
});
