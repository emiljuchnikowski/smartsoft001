import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerPresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: DrawerPresetComponent', () => {
  let fixture: ComponentFixture<DrawerPresetComponent>;
  let component: DrawerPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Offcanvas title');
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  });

  function panel(): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector(
      'aside[role="dialog"]',
    ) as HTMLElement;
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(DrawerPresetComponent);
  });

  it('should not render the panel when closed', () => {
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();

    expect(panel()).toBeNull();
  });

  it('should render the panel and title when open', () => {
    expect(panel()).toBeTruthy();
    expect(panel().textContent?.trim()).toContain('Offcanvas title');
  });

  it('should default to the right placement', () => {
    expect(panel().getAttribute('data-position')).toBe('right');
    expect(panel().className).toContain('smart:end-0');
    expect(panel().className).toContain('smart:max-w-xs');
  });

  it('should place the panel on the left when options.position is left', () => {
    fixture.componentRef.setInput('options', { position: 'left' });
    fixture.detectChanges();

    expect(panel().getAttribute('data-position')).toBe('left');
    expect(panel().className).toContain('smart:start-0');
  });

  it('should widen the panel when options.wide is true', () => {
    fixture.componentRef.setInput('options', { wide: true });
    fixture.detectChanges();

    expect(panel().className).toContain('smart:max-w-md');
    expect(panel().className).not.toContain('smart:max-w-xs');
  });

  it('should NOT render a backdrop by default', () => {
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        'div[aria-hidden="true"]',
      ),
    ).toBeNull();
  });

  it('should render a backdrop when options.withOverlay is true', () => {
    fixture.componentRef.setInput('options', { withOverlay: true });
    fixture.detectChanges();

    const backdrop = (fixture.nativeElement as HTMLElement).querySelector(
      'div[aria-hidden="true"]',
    );

    expect(backdrop).toBeTruthy();
    expect((backdrop as HTMLElement).className).toContain(
      'smart:bg-gray-900/50',
    );
  });

  it('should apply branded header classes when options.brandedHeader is true', () => {
    fixture.componentRef.setInput('options', { brandedHeader: true });
    fixture.detectChanges();

    const header = panel().querySelector('div');

    expect((header as HTMLElement).className).toContain('smart:bg-blue-600');
  });

  it('should close and emit closed when the close button is clicked', () => {
    let emitted = false;
    component.closed.subscribe(() => (emitted = true));

    panel()
      .querySelector<HTMLButtonElement>('button[aria-label="Close"]')
      ?.click();
    fixture.detectChanges();

    expect(emitted).toBe(true);
    expect(component.open()).toBe(false);
    expect(panel()).toBeNull();
  });

  it('should close when the backdrop is clicked', () => {
    fixture.componentRef.setInput('options', { withOverlay: true });
    fixture.detectChanges();

    (
      (fixture.nativeElement as HTMLElement).querySelector(
        'div[aria-hidden="true"]',
      ) as HTMLElement
    ).click();
    fixture.detectChanges();

    expect(component.open()).toBe(false);
  });

  it('should apply cssClass on the panel (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(panel().className).toContain('my-extra-class');
  });
});
