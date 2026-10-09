import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ButtonUsageExampleComponent', () => {
  let fixture: ComponentFixture<ButtonUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the projected label in the configured colour', () => {
    // Act
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    // Assert
    expect(button.textContent).toContain('Save changes');
    expect(button.type).toBe('button');
    expect(button.classList.contains('smart:bg-emerald-600')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Saves: 0');
  });

  it('should count the saves the click handler runs', () => {
    // Arrange
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    // Act
    button.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Saves: 1');
  });
});
