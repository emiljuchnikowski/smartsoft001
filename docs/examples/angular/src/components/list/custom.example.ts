// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  IListOptions,
  LIST_MODE_COMPONENTS_TOKEN,
  ListBaseComponent,
  ListComponent,
  ListMode,
} from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

// `<smart-list>` reads the columns off the model metadata, so only the fields
// marked `list: true` become keys of the rendered list.
@Model({})
export class DocsUser {
  id = '';

  @Field({ list: true, type: FieldType.text })
  firstName = '';

  @Field({ list: true, type: FieldType.email })
  email = '';

  @Field({ list: true, type: FieldType.text })
  role = '';
}

/**
 * A custom list built on `ListBaseComponent`.
 *
 * The base resolves `keys` from the model metadata, exposes the rows as the
 * `list` signal and the busy flag as `loading`; the implementation only turns
 * that into markup.
 */
@Component({
  selector: 'docs-custom-list',
  template: `
    <table [class]="containerClasses()">
      <thead>
        <tr>
          @for (key of keys; track key) {
            <th class="docs-list__header">{{ key }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.id) {
          <tr class="docs-list__row">
            @for (key of keys; track key) {
              <td class="docs-list__cell">{{ cell(row, key) }}</td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomListComponent extends ListBaseComponent<DocsUser> {
  // ListComponent passes the external class under its aliased name, so the
  // inherited `cssClass` input is used as is - do not redeclare it here.
  containerClasses = computed(() =>
    ['docs-list', this.cssClass()].filter(Boolean).join(' '),
  );

  // `list` is typed as a CDK table data source, which also covers observables
  // and DataSource instances; this example only handles the plain array form.
  rows = computed<DocsUser[]>(() => {
    const value = this.list();
    return Array.isArray(value) ? value : [];
  });

  cell(row: DocsUser, key: string): string {
    return String((row as unknown as Record<string, unknown>)[key] ?? '');
  }
}

/**
 * The list wrapper resolves its body from a map of modes rather than from a
 * single standard-component token, so the implementation is registered under
 * the mode that `IListOptions.mode` asks for. The map is merged over the
 * built-in one, so the other modes keep their own components.
 */
@Component({
  selector: 'docs-list-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListComponent],
  providers: [
    {
      provide: LIST_MODE_COMPONENTS_TOKEN,
      useValue: { [ListMode.desktop]: CustomListComponent },
    },
  ],
  template: `<smart-list [options]="options" />`,
})
export class ListCustomExampleComponent {
  // A provider is the list's data source: two signals plus the callback the
  // list calls when it needs a page. A real application hands over an NgRx
  // facade here instead of static rows.
  options: IListOptions<DocsUser> = {
    provider: {
      list: signal<DocsUser[]>([
        { id: '1', firstName: 'Jan', email: 'jan@example.com', role: 'Admin' },
        {
          id: '2',
          firstName: 'Anna',
          email: 'anna@example.com',
          role: 'User',
        },
        {
          id: '3',
          firstName: 'Piotr',
          email: 'piotr@example.com',
          role: 'User',
        },
      ]),
      loading: signal(false),
      getData: () => undefined,
    },
    type: DocsUser,
    mode: ListMode.desktop,
  };
}
// #endregion
