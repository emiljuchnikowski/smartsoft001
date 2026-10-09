import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeadingUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: SectionHeadingUsageExampleComponent', () => {
  let fixture: ComponentFixture<SectionHeadingUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHeadingUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeadingUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the heading from the options', () => {
    // Act
    const heading = element.querySelector('h3');

    // Assert
    expect(heading?.textContent).toContain('Team members');
    expect(element.textContent).toContain(
      'People who can access this project.',
    );
  });

  it('should render the label next to the title', () => {
    // Act
    const label = element.querySelector('h3 .label');

    // Assert
    expect(label?.textContent?.trim()).toBe('12 members');
  });

  it('should show the confirmation after the action button is clicked', () => {
    // Arrange
    const action = element.querySelector(
      '.actions button',
    ) as HTMLButtonElement;
    expect(element.textContent).not.toContain('Invitation sent.');

    // Act
    action.click();
    fixture.detectChanges();

    // Assert
    expect(action.textContent).toContain('Invite member');
    expect(element.textContent).toContain('Invitation sent.');
  });
});
