import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarsUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ProgressBarsUsageExampleComponent', () => {
  let fixture: ComponentFixture<ProgressBarsUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarsUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBarsUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the steps from the options', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Shipping');
    expect(element.textContent).toContain('Payment');
    expect(element.textContent).toContain('Review');
  });

  it('should hand the clicked step id to the handler', () => {
    const step: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    step.click();

    expect(fixture.componentInstance.lastStep()).toBe('shipping');
  });
});
