// #region usage
import { useMemo, useState } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import { IListOptions, ListMode, SmartList } from '@smartsoft001/react';

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

export function ListUsageExample() {
  const [selected, setSelected] = useState<Member | null>(null);

  // The provider is the data source; in an app it usually comes from a store.
  const options = useMemo<IListOptions<Member>>(
    () => ({
      type: Member,
      mode: ListMode.desktop,
      provider: { list: members, loading: false, getData: () => undefined },
      // The item action of a row calls `select` with the row's id.
      item: {
        options: {
          edit: false,
          select: (id) =>
            setSelected(members.find((member) => member.id === id) ?? null),
        },
      },
    }),
    [],
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
