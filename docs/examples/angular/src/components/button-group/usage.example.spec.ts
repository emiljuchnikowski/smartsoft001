import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroupUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ButtonGroupUsageExampleComponent', () => {
  let fixture: ComponentFixture<ButtonGroupUsageExampleComponent>;

  const buttons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="group"] button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonGroupUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the buttons and mark the selected one as pressed', () => {
    expect(buttons().map((button) => button.textContent?.trim())).toEqual([
      'Day',
      'Week',
      'Month',
    ]);
    expect(buttons()[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('should hand the clicked button id to the handler', () => {
    buttons()[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.view()).toBe('month');
    expect(buttons()[2].getAttribute('aria-pressed')).toBe('true');
  });
});
