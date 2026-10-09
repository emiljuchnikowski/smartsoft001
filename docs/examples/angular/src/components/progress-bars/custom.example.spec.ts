import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarsCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: ProgressBarsCustomExampleComponent', () => {
  let fixture: ComponentFixture<ProgressBarsCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarsCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBarsCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom progress bars through the wrapper instead of the standard one', () => {
    // Assert
    expect(
      element.querySelector('smart-progress-bars docs-custom-progress-bars'),
    ).toBeTruthy();
    expect(element.querySelector('smart-progress-bars-standard')).toBeNull();
  });

  it('should render one entry per step and mark the current one', () => {
    // Act
    const steps = element.querySelectorAll('.docs-progress-bars__step');

    // Assert
    expect(steps).toHaveLength(3);
    expect(
      element.querySelector('.docs-progress-bars__step[aria-current="step"]')
        ?.textContent,
    ).toContain('Profile');
  });

  it('should size the value bar from the options', () => {
    // Act
    const bar = element.querySelector<HTMLElement>(
      '.docs-progress-bars__value',
    );

    // Assert
    expect(bar?.style.width).toBe('50%');
  });

  it('should report the clicked step through the wrapper stepClick output', () => {
    // Arrange
    const review = element.querySelectorAll<HTMLButtonElement>(
      '.docs-progress-bars__step',
    )[2];

    // Act
    review.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Last clicked step: review');
  });
});
