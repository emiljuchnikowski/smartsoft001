import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DividerUsageExampleComponent', () => {
  let fixture: ComponentFixture<DividerUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividerUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DividerUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the title and the action label', () => {
    const divider: HTMLElement = fixture.nativeElement;

    expect(divider.textContent).toContain('Team members');
    expect(divider.textContent).toContain('Add member');
  });

  it('should position the divider from the options', () => {
    const separator = fixture.nativeElement.querySelector('[role="separator"]');

    expect(separator.getAttribute('data-position')).toBe('left');
  });

  it('should call the handler when the action is clicked', () => {
    const action: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    action.click();

    expect(fixture.componentInstance.addClicks()).toBe(1);
  });
});
