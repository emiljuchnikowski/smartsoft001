import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: TableCustomExampleComponent', () => {
  let fixture: ComponentFixture<TableCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom table through the wrapper instead of the standard one', () => {
    expect(element.querySelector('smart-table docs-custom-table')).toBeTruthy();
    expect(element.querySelector('smart-table-standard')).toBeNull();
  });

  it('should render a header cell per column and a row per record', () => {
    const headers = element.querySelectorAll('.docs-table thead th');
    const rows = element.querySelectorAll('.docs-table tbody tr');

    expect(headers.length).toBe(4);
    expect(headers[0].textContent).toContain('Name');
    expect(rows.length).toBe(3);
  });

  it('should read every cell by its column key', () => {
    const cells = element.querySelectorAll('.docs-table tbody tr td');

    expect(cells[0].textContent).toContain('Lindsay Walton');
    expect(cells[3].textContent).toContain('3');
    expect(cells[3].getAttribute('data-align')).toBe('right');
  });
});
