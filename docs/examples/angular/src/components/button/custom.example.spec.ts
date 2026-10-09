import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: ButtonCustomExampleComponent', () => {
  let fixture: ComponentFixture<ButtonCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonCustomExampleComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render the custom button with the label through <smart-button>', () => {
    // Act
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'smart-button .docs-button',
    );

    // Assert
    expect(button).not.toBeNull();
    expect(button.textContent).toContain('Save');
    expect(button.classList.contains('smart:bg-emerald-600')).toBe(true);
    expect(
      fixture.nativeElement.querySelector('smart-button-standard'),
    ).toBeNull();
  });

  it('should run the options click handler when the custom button is clicked', () => {
    // Arrange
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('.docs-button');

    // Act
    button.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Saved.');
  });
});
