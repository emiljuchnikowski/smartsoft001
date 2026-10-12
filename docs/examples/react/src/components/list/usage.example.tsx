// #region usage
import { useMemo, useState } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import {
  IListOptions,
  IListSortFilter,
  ListMode,
  SmartList,
} from '@smartsoft001/react';

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

// The headers sort the list, starting from the last name. A constant, so the
// list keeps the sort a header click chose.
const SORT = { default: 'lastName' };

export function ListUsageExample() {
  const [selected, setSelected] = useState<Member | null>(null);
  const [list, setList] = useState(() => sortMembers('lastName', false));

  // The provider is the data source; in an app it usually comes from a store.
  const options = useMemo<IListOptions<Member>>(
    () => ({
      type: Member,
      mode: ListMode.desktop,
      provider: {
        list,
        loading: false,
        // A click on a column header asks for the rows sorted by that column.
        getData: ({ sortBy, sortDesc }: IListSortFilter) =>
          setList(sortMembers(sortBy, sortDesc)),
      },
      sort: SORT,
      // The item action of a row calls `select` with the row's id.
      item: {
        options: {
          edit: false,
          select: (id) =>
            setSelected(members.find((member) => member.id === id) ?? null),
        },
      },
    }),
    [list],
  );

  return (
    <>
      <SmartList options={options} />

      {selected && (
        <p>
          Selected member: {selected.firstName} {selected.lastName}
        </p>
      )}
    </>
  );
}
// #endregion
