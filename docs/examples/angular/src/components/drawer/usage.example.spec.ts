import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DrawerUsageExampleComponent', () => {
  let fixture: ComponentFixture<DrawerUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should keep the drawer closed until it is opened', () => {
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');

    expect(dialog).toBeNull();
  });

  it('should render the title and the projected content when opened', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const dialog: HTMLElement =
      fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog.textContent).toContain('Shopping cart');
    expect(dialog.textContent).toContain('Throwback Hip Bag');
    expect(dialog.getAttribute('data-position')).toBe('right');
  });

  it('should close the drawer and call the handler from the close button', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const close: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Close"]',
    );

    close.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.closedCount()).toBe(1);
  });
});
