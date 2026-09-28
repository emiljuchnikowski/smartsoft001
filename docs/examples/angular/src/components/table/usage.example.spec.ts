import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: TableUsageExampleComponent', () => {
  let fixture: ComponentFixture<TableUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the column headers from the options', () => {
    const headers: string[] = Array.from(
      fixture.nativeElement.querySelectorAll('th') as NodeListOf<HTMLElement>,
    ).map((th) => th.textContent?.trim() ?? '');

    expect(headers).toEqual(['Name', 'Title', 'Email', 'Role']);
  });

  it('should render one table row per data row', () => {
    const rows: NodeListOf<HTMLTableRowElement> =
      fixture.nativeElement.querySelectorAll('tbody tr');

    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('Lindsay Walton');
    expect(rows[0].textContent).toContain('lindsay.walton@example.com');
  });
});
