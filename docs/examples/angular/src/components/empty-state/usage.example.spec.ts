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
    const emptyState: HTMLElement = fixture.nativeElement;

    expect(emptyState.textContent).toContain('No projects');
    expect(emptyState.textContent).toContain(
      'Get started by creating a new project.',
    );
    expect(emptyState.textContent).toContain('New project');
  });

  it('should hand the clicked action id to the handler', () => {
    const action: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.action');

    action.click();

    expect(fixture.componentInstance.lastAction()).toBe('new-project');
  });
});
