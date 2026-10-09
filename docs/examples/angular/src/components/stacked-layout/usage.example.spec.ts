import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedLayoutUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: StackedLayoutUsageExampleComponent', () => {
  let fixture: ComponentFixture<StackedLayoutUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedLayoutUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StackedLayoutUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the navigation template and the title from the options', () => {
    // Act
    const title = element.querySelector('header h1[data-role="title"]');

    // Assert
    expect(element.querySelector('nav')?.textContent).toContain('Dashboard');
    expect(title?.textContent).toContain('Projects');
  });

  it('should expose the default container width on the layout root', () => {
    // Act
    const root = element.querySelector('[data-container-width]');

    // Assert
    expect(root?.getAttribute('data-container-width')).toBe('xl');
  });

  it('should project the page content into the main area', () => {
    // Act
    const main = element.querySelector('main');

    // Assert
    expect(main?.textContent).toContain('You have 3 active projects');
  });
});
