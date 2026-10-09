import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DropdownUsageExampleComponent', () => {
  let fixture: ComponentFixture<DropdownUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  function trigger(): HTMLButtonElement {
    return element.querySelector(
      '.smart-dropdown-trigger',
    ) as HTMLButtonElement;
  }

  function openMenu(): void {
    trigger().click();
    fixture.detectChanges();
  }

  it('should render the trigger label with the menu closed', () => {
    // Assert
    expect(trigger().textContent).toContain('Options');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(element.querySelector('[role="menu"]')).toBeNull();
  });

  it('should render the header and the items when opened', () => {
    // Act
    openMenu();

    // Assert
    const menu = element.querySelector('[role="menu"]') as HTMLElement;
    const license = Array.from(menu.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('License'),
    );
    expect(menu.textContent).toContain('Signed in as tom@example.com');
    expect(menu.textContent).toContain('Account settings');
    expect(license?.disabled).toBe(true);
  });

  it('should show the selected item id and close the menu', () => {
    // Arrange
    openMenu();
    const item = element.querySelector(
      '[role="menuitem"] button',
    ) as HTMLButtonElement;

    // Act
    item.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Selected: settings');
    expect(element.querySelector('[role="menu"]')).toBeNull();
  });
});
