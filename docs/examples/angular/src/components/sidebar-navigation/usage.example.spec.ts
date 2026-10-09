import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavigationUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: SidebarNavigationUsageExampleComponent', () => {
  let fixture: ComponentFixture<SidebarNavigationUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavigationUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavigationUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function toggle(): HTMLButtonElement {
    return element.querySelector('.item-toggle') as HTMLButtonElement;
  }

  it('should render the items from the options', () => {
    // Act
    const nav = element.querySelector('nav');

    // Assert
    expect(nav?.getAttribute('aria-label')).toBe('Main');
    expect(nav?.textContent).toContain('Dashboard');
    expect(toggle().textContent).toContain('Reports');
    expect(element.textContent).toContain('Anna Kowalska');
  });

  it('should show the clicked item under the navigation', () => {
    // Arrange
    const dashboard = element.querySelector(
      '.item-button',
    ) as HTMLButtonElement;

    // Act
    dashboard.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Active item: dashboard');
  });

  it('should show the toggled section and open its children', () => {
    // Act
    toggle().click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Expanded section: reports');
    expect(element.querySelector('.children')?.textContent).toContain(
      'Revenue',
    );
  });

  it('should clear the expanded section when it is closed again', () => {
    // Arrange
    toggle().click();
    fixture.detectChanges();

    // Act
    toggle().click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).not.toContain('Expanded section');
  });
});
