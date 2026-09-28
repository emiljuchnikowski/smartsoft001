// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { IListOptions, ListComponent, ListMode } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({})
class Member {
  id = '';

  @Field({ list: { order: 1 }, type: FieldType.text })
  name = '';

  @Field({ list: { order: 2 }, type: FieldType.email })
  email = '';
}

@Component({
  selector: 'docs-list-usage-example',
  imports: [ListComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUsageExampleComponent {
  readonly selectedId = signal<string | null>(null);

  // The provider is the data source; in an app it is usually an NgRx facade.
  readonly options: IListOptions<Member> = {
    type: Member,
    mode: ListMode.desktop,
    provider: {
      list: signal<Member[]>([
        {
          id: '1',
          name: 'Lindsay Walton',
          email: 'lindsay.walton@example.com',
        },
        {
          id: '2',
          name: 'Courtney Henry',
          email: 'courtney.henry@example.com',
        },
        { id: '3', name: 'Tom Cook', email: 'tom.cook@example.com' },
      ]),
      loading: signal(false),
      getData: () => undefined,
    },
    item: { options: { edit: false, select: (id) => this.selectedId.set(id) } },
  };
}
// #endregion
