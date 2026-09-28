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
    const panel: HTMLElement = fixture.nativeElement;

    expect(panel.textContent).toContain('Manage subscription');
    expect(panel.textContent).toContain('Change plan');
  });

  it('should hand the clicked action id to the handler', () => {
    const action: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    action.click();

    expect(fixture.componentInstance.lastAction()).toBe('change-plan');
  });
});
