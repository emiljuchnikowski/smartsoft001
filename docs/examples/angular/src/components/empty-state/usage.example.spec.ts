import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: EmptyStateUsageExampleComponent', () => {
  let fixture: ComponentFixture<EmptyStateUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the title, description and action from the options', () => {
    // Arrange
    const emptyState: HTMLElement = fixture.nativeElement;

    // Assert
    expect(emptyState.textContent).toContain('No projects');
    expect(emptyState.textContent).toContain(
      'Get started by creating a new project.',
    );
    expect(emptyState.textContent).toContain('New project');
  });

  it('should show the id of the clicked action', () => {
    // Arrange
    const action: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.action');

    // Act
    action.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain(
      'Last action: new-project',
    );
  });
});
