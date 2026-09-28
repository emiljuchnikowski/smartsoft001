import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedListUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: StackedListUsageExampleComponent', () => {
  let fixture: ComponentFixture<StackedListUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedListUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StackedListUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the list heading from the options', () => {
    const list: HTMLElement = fixture.nativeElement;

    expect(list.textContent).toContain('Team members');
  });

  it('should render one row per item with its details', () => {
    const rows: NodeListOf<HTMLLIElement> =
      fixture.nativeElement.querySelectorAll('li');

    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('Leslie Alexander');
    expect(rows[0].textContent).toContain('Co-Founder / CEO');
  });
});
