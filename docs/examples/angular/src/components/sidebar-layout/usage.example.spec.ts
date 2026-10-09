import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLayoutUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: SidebarLayoutUsageExampleComponent', () => {
  let fixture: ComponentFixture<SidebarLayoutUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarLayoutUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarLayoutUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the sidebar template from the options', () => {
    // Act
    const aside = element.querySelector('aside');

    // Assert
    expect(aside?.textContent).toContain('Projects');
    expect(aside?.querySelector('nav')?.getAttribute('aria-label')).toBe(
      'Main',
    );
  });

  it('should project the page content into the main area', () => {
    // Act
    const main = element.querySelector('main');

    // Assert
    expect(main?.textContent).toContain('Dashboard');
    expect(main?.textContent).toContain(
      'Welcome back. Here is what changed since yesterday.',
    );
  });

  it('should place the sidebar before the main area on the left', () => {
    // Arrange
    const aside = element.querySelector('aside') as HTMLElement;
    const main = element.querySelector('main') as HTMLElement;

    // Act
    const position = aside.compareDocumentPosition(main);

    // Assert
    expect(position).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});
