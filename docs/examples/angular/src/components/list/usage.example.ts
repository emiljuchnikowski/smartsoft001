// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  IListOptions,
  IListSortFilter,
  ListComponent,
  ListMode,
} from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({})
class Member {
  id = '';

  @Field({ list: { order: 1 }, type: FieldType.text })
  firstName = '';

  @Field({ list: { order: 2 }, type: FieldType.text })
  lastName = '';

  @Field({ list: { order: 3 }, type: FieldType.email })
  email = '';
}

const members: Member[] = [
  {
    id: '1',
    firstName: 'Lindsay',
    lastName: 'Walton',
    email: 'lindsay.walton@example.com',
  },
  {
    id: '2',
    firstName: 'Courtney',
    lastName: 'Henry',
    email: 'courtney.henry@example.com',
  },
  {
    id: '3',
    firstName: 'Tom',
    lastName: 'Cook',
    email: 'tom.cook@example.com',
  },
];

// Stands in for the server: the rows of `members` in the order asked for.
function sortMembers(key: string, desc: boolean): Member[] {
  const field = key as keyof Member;

  return [...members].sort(
    (a, b) => a[field].localeCompare(b[field]) * (desc ? -1 : 1),
  );
}

@Component({
  selector: 'docs-list-usage-example',
  imports: [ListComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUsageExampleComponent {
  readonly selected = signal<Member | null>(null);
  readonly members = signal(sortMembers('lastName', false));

  // The provider is the data source; in an app it is usually an NgRx facade.
  readonly options: IListOptions<Member> = {
    type: Member,
    mode: ListMode.desktop,
    provider: {
      list: this.members,
      loading: signal(false),
      // A click on a column header asks for the rows sorted by that column.
      getData: ({ sortBy, sortDesc }: IListSortFilter) =>
        this.members.set(sortMembers(sortBy, sortDesc)),
    },
    // The headers sort the list, starting from the last name.
    sort: { default: 'lastName' },
    // The item action of a row calls `select` with the row's id.
    item: {
      options: {
        edit: false,
        select: (id) =>
          this.selected.set(members.find((member) => member.id === id) ?? null),
      },
    },
  };
}
// #endregion
