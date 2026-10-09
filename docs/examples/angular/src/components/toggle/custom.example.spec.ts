import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: ToggleCustomExampleComponent', () => {
  let fixture: ComponentFixture<ToggleCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom toggle through the wrapper instead of the standard one', () => {
    // Assert
    expect(
      element.querySelector('smart-toggle docs-custom-toggle'),
    ).toBeTruthy();
    expect(element.querySelector('smart-toggle-standard')).toBeNull();
  });

  it('should render the label and the description from the options', () => {
    // Act
    const label = element.querySelector('.docs-toggle__label');
    const description = element.querySelector('.docs-toggle__description');

    // Assert
    expect(label?.textContent).toContain('Allow notifications');
    expect(description?.textContent).toContain('Send me an email');
    expect(element.textContent).toContain('Notifications are off.');
  });

  it('should write the new state back through the wrapper [(value)]', () => {
    // Arrange
    const input = element.querySelector(
      '.docs-toggle__input',
    ) as HTMLInputElement;

    // Act
    input.click();
    fixture.detectChanges();

    // Assert
    expect(input.checked).toBe(true);
    expect(fixture.componentInstance.enabled()).toBe(true);
    expect(element.textContent).toContain('Notifications are on.');
  });
});
