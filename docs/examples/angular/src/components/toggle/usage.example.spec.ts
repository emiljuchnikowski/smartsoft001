import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ToggleUsageExampleComponent', () => {
  let fixture: ComponentFixture<ToggleUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the switch from the options and the bound value', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.getAttribute('aria-label')).toBe('Email notifications');
    expect(input.checked).toBe(true);
  });

  it('should write the new state back to the component', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.click();

    expect(fixture.componentInstance.emailNotifications()).toBe(false);
  });
});
