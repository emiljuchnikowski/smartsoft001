import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: StatsCustomExampleComponent', () => {
  let fixture: ComponentFixture<StatsCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom stats through the wrapper instead of the standard one', () => {
    expect(element.querySelector('smart-stats docs-custom-stats')).toBeTruthy();
    expect(element.querySelector('smart-stats-standard')).toBeNull();
  });

  it('should render one entry per item with its label and value', () => {
    const items = element.querySelectorAll('.docs-stats__item');

    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('Accuracy rate');
    expect(items[0].textContent).toContain('99.95%');
  });

  it('should expose the column count and the trend of a changed item', () => {
    const list = element.querySelector('.docs-stats');
    const trend = element.querySelector('.docs-stats__change');

    expect(list?.getAttribute('data-columns')).toBe('3');
    expect(trend?.getAttribute('data-trend')).toBe('up');
  });
});
