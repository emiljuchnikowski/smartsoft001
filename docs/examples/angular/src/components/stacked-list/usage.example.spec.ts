import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedListUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: StackedListUsageExampleComponent', () => {
  let fixture: ComponentFixture<StackedListUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedListUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StackedListUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the list heading from the options', () => {
    // Act
    const heading = element.querySelector('h3');

    // Assert
    expect(heading?.textContent).toContain('Team members');
    expect(element.textContent).toContain(
      'People with access to this workspace.',
    );
  });

  it('should render one row per item with its details', () => {
    // Act
    const rows = element.querySelectorAll('li');

    // Assert
    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('Leslie Alexander');
    expect(rows[0].textContent).toContain('Co-Founder / CEO');
  });

  it('should render the title of an item with a href as a link', () => {
    // Act
    const link = element.querySelector('li a');

    // Assert
    expect(link?.textContent).toContain('Leslie Alexander');
    expect(link?.getAttribute('href')).toBe('/team/leslie');
  });
});
