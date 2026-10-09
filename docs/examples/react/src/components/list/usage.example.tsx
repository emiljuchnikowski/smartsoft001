// #region usage
import { useMemo, useState } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import { IListOptions, ListMode, SmartList } from '@smartsoft001/react';

@Model({})
class Member {
  id = '';

  @Field({ list: { order: 1 }, type: FieldType.text })
  name = '';

  @Field({ list: { order: 2 }, type: FieldType.email })
  email = '';
}

const members: Member[] = [
  { id: '1', name: 'Lindsay Walton', email: 'lindsay.walton@example.com' },
  { id: '2', name: 'Courtney Henry', email: 'courtney.henry@example.com' },
  { id: '3', name: 'Tom Cook', email: 'tom.cook@example.com' },
];

export function ListUsageExample() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // The provider is the data source; in an app it usually comes from a store.
  const options = useMemo<IListOptions<Member>>(
    () => ({
      type: Member,
      mode: ListMode.desktop,
      provider: { list: members, loading: false, getData: () => undefined },
      item: { options: { edit: false, select: setSelectedId } },
    }),
    [],
  );

  return (
    <>
      <SmartList options={options} />
      {selectedId && <p>Selected member: {selectedId}</p>}
    </>
  );
}
// #endregion
