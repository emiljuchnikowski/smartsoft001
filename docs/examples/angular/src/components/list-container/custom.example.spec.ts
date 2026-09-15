import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContainerCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: ListContainerCustomExampleComponent', () => {
  let fixture: ComponentFixture<ListContainerCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListContainerCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListContainerCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom list container through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-list-container docs-custom-list-container'),
    ).toBeTruthy();
    expect(element.querySelector('smart-list-container-standard')).toBeNull();
  });

  it('should render one row per member of the custom implementation', () => {
    const rows = element.querySelectorAll('.docs-list-container__item');

    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('Lindsay Walton');
  });

  it('should turn the variant from the options into a modifier class', () => {
    const container = element.querySelector('.docs-list-container');

    expect(container?.classList).toContain(
      'docs-list-container--separate-cards',
    );
    expect(container?.getAttribute('role')).toBe('list');
  });
});
