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

  it('should render the title and the description from the options', () => {
    // Act
    const element: HTMLElement = fixture.nativeElement;

    // Assert
    expect(element.querySelector('h3')?.textContent).toContain('Users');
    expect(element.textContent).toContain(
      'Everyone in your account, with their title and role.',
    );
  });

  it('should render the column headers from the options', () => {
    // Act
    const headers: string[] = Array.from(
      fixture.nativeElement.querySelectorAll('th') as NodeListOf<HTMLElement>,
    ).map((th) => th.textContent?.trim() ?? '');

    // Assert
    expect(headers).toEqual(['Name', 'Title', 'Email', 'Role']);
  });

  it('should render one table row per data row', () => {
    // Act
    const rows: NodeListOf<HTMLTableRowElement> =
      fixture.nativeElement.querySelectorAll('tbody tr');

    // Assert
    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('Lindsay Walton');
    expect(rows[0].textContent).toContain('lindsay.walton@example.com');
  });

  it('should mark the alignment of the Role column', () => {
    // Act
    const cells = Array.from(
      fixture.nativeElement.querySelectorAll(
        '[data-align]',
      ) as NodeListOf<HTMLElement>,
    ).map((cell) => cell.textContent?.trim());

    // Assert
    expect(cells).toEqual(['Role', 'Member', 'Admin', 'Member']);
  });
});
