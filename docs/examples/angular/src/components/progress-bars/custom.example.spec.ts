import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CustomProgressBarsComponent,
  ProgressBarsCustomExampleComponent,
} from './custom.example';

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
    expect(
      element.querySelector('smart-progress-bars docs-custom-progress-bars'),
    ).toBeTruthy();
    expect(element.querySelector('smart-progress-bars-standard')).toBeNull();
  });

  it('should render one entry per step and mark the current one', () => {
    const steps = element.querySelectorAll('.docs-progress-bars__step');

    expect(steps).toHaveLength(3);
    expect(
      element.querySelector('.docs-progress-bars__step[aria-current="step"]')
        ?.textContent,
    ).toContain('Profile');
  });

  it('should size the value bar from the options', () => {
    const bar = element.querySelector<HTMLElement>(
      '.docs-progress-bars__value',
    );

    expect(bar?.style.width).toBe('50%');
  });

  // NgComponentOutlet does not forward outputs, so stepClick never reaches the
  // wrapper; it is asserted on the custom component instance instead.
  it('should emit stepClick from the custom component when a step is clicked', () => {
    const custom: CustomProgressBarsComponent = fixture.debugElement.query(
      By.directive(CustomProgressBarsComponent),
    ).componentInstance;
    const clicked: string[] = [];
    custom.stepClick.subscribe((event) => clicked.push(event.stepId));

    element
      .querySelectorAll<HTMLButtonElement>('.docs-progress-bars__step')[2]
      .click();

    expect(clicked).toEqual(['review']);
  });
});
