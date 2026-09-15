import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  ActionPanelCustomExampleComponent,
  CustomActionPanelComponent,
} from './custom.example';

describe('docs-examples-angular: ActionPanelCustomExampleComponent', () => {
  let fixture: ComponentFixture<ActionPanelCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPanelCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionPanelCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom action panel instead of the standard one', () => {
    const panel = fixture.nativeElement.querySelector('.docs-action-panel');

    expect(panel).not.toBeNull();
    expect(panel.textContent).toContain('Transfer ownership');
    expect(
      fixture.nativeElement.querySelector('smart-action-panel-standard'),
    ).toBeNull();
  });

  it('should emit actionClick with the action id when an action is clicked', () => {
    const panel: CustomActionPanelComponent = fixture.debugElement.query(
      By.directive(CustomActionPanelComponent),
    ).componentInstance;
    const emitted: string[] = [];
    panel.actionClick.subscribe((event) => emitted.push(event.actionId));

    const action: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.docs-action-panel__action',
    );
    action.click();

    expect(emitted).toEqual(['transfer']);
  });
});
