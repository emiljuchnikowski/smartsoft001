import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPanelUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ActionPanelUsageExampleComponent', () => {
  let fixture: ComponentFixture<ActionPanelUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPanelUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionPanelUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the panel from the options', () => {
    // Arrange
    const panel: HTMLElement = fixture.nativeElement;

    // Act (nothing: the first render)

    // Assert
    expect(panel.textContent).toContain('Manage subscription');
    expect(panel.textContent).toContain(
      'Change your plan or cancel at the end of the billing period.',
    );
    expect(panel.textContent).toContain('Change plan');
    expect(panel.textContent).not.toContain('Last action');
  });

  it('should show the clicked action id under the panel', () => {
    // Arrange
    const action: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    // Act
    action.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain(
      'Last action: change-plan',
    );
  });
});
