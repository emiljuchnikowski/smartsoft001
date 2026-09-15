import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridListCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: GridListCustomExampleComponent', () => {
  let fixture: ComponentFixture<GridListCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridListCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GridListCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom grid list through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-grid-list docs-custom-grid-list'),
    ).toBeTruthy();
    expect(element.querySelector('smart-grid-list-standard')).toBeNull();
    expect(
      element.querySelector('.docs-grid-list__title')?.textContent,
    ).toContain('Team');
  });

  it('should render one cell per item and expose the column count', () => {
    const list = element.querySelector('.docs-grid-list__items');

    expect(element.querySelectorAll('.docs-grid-list__item')).toHaveLength(3);
    expect(list?.getAttribute('data-columns')).toBe('3');
  });

  it('should render a link for an item with href and plain text otherwise', () => {
    const link = element.querySelector<HTMLAnchorElement>(
      '.docs-grid-list__link',
    );

    expect(link?.getAttribute('href')).toBe('/team/lindsay-walton');
    expect(element.querySelectorAll('.docs-grid-list__label')).toHaveLength(2);
  });
});
