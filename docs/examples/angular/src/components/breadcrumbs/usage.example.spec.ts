import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbsUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: BreadcrumbsUsageExampleComponent', () => {
  let fixture: ComponentFixture<BreadcrumbsUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the trail from the options', () => {
    // Act
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');

    // Assert
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(nav.textContent).toContain('Projects');
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toContain(
      'Project Nero',
    );
  });

  it('should separate the items with slashes', () => {
    // Act
    const separator: HTMLElement = fixture.nativeElement.querySelector(
      '.breadcrumbs-separator',
    );

    // Assert
    expect(separator.getAttribute('data-separator')).toBe('slash');
  });

  it('should show the clicked item id under the trail', () => {
    // Arrange
    const projects: HTMLButtonElement =
      fixture.nativeElement.querySelectorAll('nav button')[1];

    // Act
    projects.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain(
      'Last clicked: projects',
    );
  });
});
