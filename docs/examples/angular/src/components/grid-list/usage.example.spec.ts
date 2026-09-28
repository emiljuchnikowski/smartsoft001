import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridListUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: GridListUsageExampleComponent', () => {
  let fixture: ComponentFixture<GridListUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridListUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GridListUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the title and items from the options', () => {
    const grid: HTMLElement = fixture.nativeElement;

    expect(grid.textContent).toContain('Team');
    expect(grid.textContent).toContain('Lindsay Walton');
    expect(grid.textContent).toContain('Tom Cook');
  });

  it('should render one tile per item', () => {
    const tiles = fixture.nativeElement.querySelectorAll('li');

    expect(tiles.length).toBe(3);
  });
});
