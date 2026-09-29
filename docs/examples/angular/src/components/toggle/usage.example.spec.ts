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

    expect(input.labels?.[0]?.textContent?.trim()).toBe('Email notifications');
    expect(input.checked).toBe(true);
  });

  it('should describe the switch with the description text', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    const description = fixture.nativeElement.querySelector(
      `#${input.getAttribute('aria-describedby')}`,
    );

    expect(description.textContent.trim()).toBe(
      'Get an email when someone comments on your post.',
    );
  });

  it('should write the new state back to the component', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.click();

    expect(fixture.componentInstance.emailNotifications()).toBe(false);
  });
});
