import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedListCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: StackedListCustomExampleComponent', () => {
  let fixture: ComponentFixture<StackedListCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedListCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StackedListCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom list through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-stacked-list docs-custom-stacked-list'),
    ).toBeTruthy();
    expect(element.querySelector('smart-stacked-list-standard')).toBeNull();
  });

  it('should render one row per item with its title and description', () => {
    const items = element.querySelectorAll('.docs-stacked-list__item');

    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('Lindsay Walton');
    expect(items[0].textContent).toContain('lindsay.walton@example.com');
  });

  it('should add the divider modifier because the options ask for it', () => {
    const list = element.querySelector('.docs-stacked-list');

    expect(list?.classList).toContain('docs-stacked-list--divided');
  });
});
