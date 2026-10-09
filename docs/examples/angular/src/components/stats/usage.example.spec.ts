import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: StatsUsageExampleComponent', () => {
  let fixture: ComponentFixture<StatsUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the title and every stat from the options', () => {
    // Act
    const stats: HTMLElement = fixture.nativeElement;

    // Assert
    expect(stats.textContent).toContain('Last 30 days');
    expect(stats.querySelectorAll('dt')).toHaveLength(3);
    expect(stats.textContent).toContain('Total subscribers');
    expect(stats.textContent).toContain('71,897');
  });

  it('should mark the change with its trend', () => {
    // Act
    const change: HTMLElement =
      fixture.nativeElement.querySelector('[data-trend]');

    // Assert
    expect(change.getAttribute('data-trend')).toBe('up');
    expect(change.textContent).toContain('12%');
  });
});
