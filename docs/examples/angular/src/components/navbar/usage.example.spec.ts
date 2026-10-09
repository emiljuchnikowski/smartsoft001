import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: NavbarUsageExampleComponent', () => {
  let fixture: ComponentFixture<NavbarUsageExampleComponent>;
  let element: HTMLElement;

  const itemButton = (label: string) =>
    Array.from(
      element.querySelectorAll<HTMLButtonElement>('.items .item-button'),
    ).find((button) => button.textContent?.includes(label));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should render the logo and items from the options', () => {
    // Act
    const logo = element.querySelector('.logo img');

    // Assert
    expect(logo?.getAttribute('alt')).toBe('Acme');
    expect(logo?.getAttribute('src')).toMatch(/^https:\/\//);
    expect(element.querySelector('.items')?.textContent).toContain('Dashboard');
    expect(element.querySelector('.items')?.textContent).toContain('Projects');
  });

  it('should mark the first item as current', () => {
    // Act
    const dashboard = itemButton('Dashboard');

    // Assert
    expect(dashboard?.classList.contains('current')).toBe(true);
  });

  it('should make the clicked item current through the handler', () => {
    // Arrange
    const projects = itemButton('Projects');

    // Act
    projects?.click();
    fixture.detectChanges();

    // Assert
    expect(itemButton('Projects')?.classList.contains('current')).toBe(true);
    expect(itemButton('Dashboard')?.classList.contains('current')).toBe(false);
  });
});
