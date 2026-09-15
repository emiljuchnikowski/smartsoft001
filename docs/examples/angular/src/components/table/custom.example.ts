// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  ITableOptions,
  TABLE_STANDARD_COMPONENT_TOKEN,
  TableBaseComponent,
  TableComponent,
  TableRow,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-table',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h3 class="docs-table__title">{{ options()!.title }}</h3>
      }
      @if (options()?.description) {
        <p class="docs-table__description">{{ options()!.description }}</p>
      }

      <table>
        <thead>
          <tr>
            @for (col of options()?.columns ?? []; track col.key) {
              <th scope="col" [attr.data-align]="col.align ?? null">
                {{ col.label ?? col.key }}
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of options()?.rows ?? []; track $index) {
            <tr>
              @for (col of options()?.columns ?? []; track col.key) {
                <td [attr.data-align]="col.align ?? null">
                  {{ readCell(row, col.key) }}
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTableComponent extends TableBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    [
      'docs-table',
      this.options()?.striped ? 'docs-table--striped' : '',
      this.options()?.withBorder ? 'docs-table--bordered' : '',
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );

  // Rows are plain records, so cells are read by the column key.
  protected readCell(row: TableRow, key: string): unknown {
    return row[key];
  }
}

@Component({
  selector: 'docs-table-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent],
  // The token swaps the standard table for the custom one everywhere below this
  // component, so consumers keep writing `<smart-table>`.
  providers: [
    {
      provide: TABLE_STANDARD_COMPONENT_TOKEN,
      useValue: CustomTableComponent,
    },
  ],
  template: `<smart-table [options]="options" />`,
})
export class TableCustomExampleComponent {
  options: ITableOptions = {
    title: 'Users',
    description: 'Everyone with access to this workspace.',
    striped: true,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'email', label: 'Email' },
      { key: 'seats', label: 'Seats', align: 'right' },
    ],
    rows: [
      {
        name: 'Lindsay Walton',
        role: 'Front-end Developer',
        email: 'lindsay.walton@example.com',
        seats: 3,
      },
      {
        name: 'Courtney Henry',
        role: 'Designer',
        email: 'courtney.henry@example.com',
        seats: 1,
      },
      {
        name: 'Tom Cook',
        role: 'Director of Product',
        email: 'tom.cook@example.com',
        seats: 8,
      },
    ],
  };
}
// #endregion
