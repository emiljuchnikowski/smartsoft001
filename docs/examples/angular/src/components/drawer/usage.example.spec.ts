import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DrawerUsageExampleComponent', () => {
  let fixture: ComponentFixture<DrawerUsageExampleComponent>;
  let element: HTMLElement;

  function openDrawer(): void {
    element.querySelector<HTMLButtonElement>('smart-button button')?.click();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should keep the drawer closed until it is opened', () => {
    // Assert
    expect(element.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should render the title and the projected content when opened', () => {
    // Act
    openDrawer();

    // Assert
    const dialog = element.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.textContent).toContain('Shopping cart');
    expect(dialog.textContent).toContain('Throwback Hip Bag');
    expect(dialog.getAttribute('data-position')).toBe('right');
  });

  it('should close the drawer from the close button and count it', () => {
    // Arrange
    openDrawer();
    const close = element.querySelector<HTMLButtonElement>(
      'button[aria-label="Close"]',
    );

    // Act
    close?.click();
    fixture.detectChanges();

    // Assert
    expect(element.querySelector('[role="dialog"]')).toBeNull();
    expect(element.textContent).toContain('Times closed: 1');
  });

  it('should close the drawer from the overlay', () => {
    // Arrange
    openDrawer();

    // Act
    element.querySelector<HTMLElement>('.drawer-overlay')?.click();
    fixture.detectChanges();

    // Assert
    expect(element.querySelector('[role="dialog"]')).toBeNull();
    expect(element.textContent).toContain('Times closed: 1');
  });
});
