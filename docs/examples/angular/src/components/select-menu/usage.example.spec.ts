import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMenuUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: SelectMenuUsageExampleComponent', () => {
  let fixture: ComponentFixture<SelectMenuUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMenuUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectMenuUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function select(): HTMLSelectElement {
    return element.querySelector('select') as HTMLSelectElement;
  }

  it('should render the placeholder and the items from the options', () => {
    // Act
    const labels = Array.from(select().options, (option) =>
      option.textContent?.trim(),
    );

    // Assert
    expect(labels).toEqual([
      'Choose a plan',
      'Starter',
      'Professional',
      'Enterprise',
    ]);
    expect(select().getAttribute('aria-label')).toBe('Subscription plan');
  });

  it('should disable the item marked as disabled', () => {
    // Act
    const enterprise = Array.from(select().options).find(
      (option) => option.value === 'enterprise',
    );

    // Assert
    expect(enterprise?.disabled).toBe(true);
  });

  it('should show the chosen plan under the select', () => {
    // Arrange
    select().value = 'pro';

    // Act
    select().dispatchEvent(new Event('change'));
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Selected plan: pro');
  });
});
