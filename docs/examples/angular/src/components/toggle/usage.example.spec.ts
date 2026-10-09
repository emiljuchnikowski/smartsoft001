import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ToggleUsageExampleComponent', () => {
  let fixture: ComponentFixture<ToggleUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function input(): HTMLInputElement {
    return element.querySelector('input') as HTMLInputElement;
  }

  it('should render the switch from the options and the bound value', () => {
    // Act
    const checkbox = input();

    // Assert
    expect(checkbox.labels?.[0]?.textContent?.trim()).toBe(
      'Email notifications',
    );
    expect(checkbox.checked).toBe(true);
    expect(element.textContent).toContain('Email notifications are on.');
  });

  it('should describe the switch with the description text', () => {
    // Act
    const description = element.querySelector(
      `#${input().getAttribute('aria-describedby')}`,
    );

    // Assert
    expect(description?.textContent?.trim()).toBe(
      'Get an email when someone comments on your post.',
    );
  });

  it('should write the new state back and show it', () => {
    // Act
    input().click();
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.emailNotifications()).toBe(false);
    expect(element.textContent).toContain('Email notifications are off.');
  });
});
