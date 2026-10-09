import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHeadingUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: CardHeadingUsageExampleComponent', () => {
  let fixture: ComponentFixture<CardHeadingUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHeadingUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardHeadingUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the title and description from the options', () => {
    // Act
    const heading: HTMLElement = fixture.nativeElement;

    // Assert
    expect(heading.querySelector('h3')?.textContent).toContain('Job postings');
    expect(heading.textContent).toContain('Open roles across all teams');
    expect(heading.textContent).toContain('Jobs created: 0');
  });

  it('should count the jobs the action button creates', () => {
    // Arrange
    const action: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.actions smart-button button',
    );

    // Act
    action.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Jobs created: 1');
  });
});
