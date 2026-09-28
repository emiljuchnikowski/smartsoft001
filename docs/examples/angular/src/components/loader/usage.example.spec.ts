import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: LoaderUsageExampleComponent', () => {
  let fixture: ComponentFixture<LoaderUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should show the spinner with the configured size and color while loading', () => {
    const spinner: SVGElement =
      fixture.nativeElement.querySelector('[role="status"]');

    expect(spinner.getAttribute('class')).toContain('smart:size-8');
    expect(spinner.getAttribute('class')).toContain('smart:text-emerald-600');
  });

  it('should hide the spinner once loading finishes', () => {
    fixture.componentInstance.loading.set(false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });
});
