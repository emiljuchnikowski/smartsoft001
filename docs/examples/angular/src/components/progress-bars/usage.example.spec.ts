import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarsUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ProgressBarsUsageExampleComponent', () => {
  let fixture: ComponentFixture<ProgressBarsUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarsUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBarsUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the steps from the options', () => {
    // Arrange
    const text = element.textContent;

    // Assert
    expect(text).toContain('Shipping');
    expect(text).toContain('Payment');
    expect(text).toContain('Review');
  });

  it('should label the navigation and mark the current step', () => {
    // Arrange
    const nav = element.querySelector('nav');

    // Act
    const current = element.querySelector('[aria-current="step"]');

    // Assert
    expect(nav?.getAttribute('aria-label')).toBe('Checkout progress');
    expect(current?.textContent).toContain('Payment');
  });

  it('should show the clicked step under the progress bars', () => {
    // Arrange
    const step = element.querySelector('button') as HTMLButtonElement;

    // Act
    step.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Last clicked step: shipping');
  });
});
