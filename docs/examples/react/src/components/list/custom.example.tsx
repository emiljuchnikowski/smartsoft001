// #region usage
import { useMemo } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import {
  IListOptions,
  ListMode,
  SmartList,
  SmartListModeProps,
  SmartProvider,
  useList,
} from '@smartsoft001/react';

// `SmartList` reads the columns off the model metadata, so only the fields
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
 * A custom list mode built on `useList`: the hook resolves the column `keys`
 * from the model metadata and exposes the provider's rows as `list`; the
 * implementation only turns that into markup.
 */
export function CustomList(props: SmartListModeProps<DocsUser>) {
  const { keys, list } = useList(props);

  return (
    <table className={['docs-list', props.className].filter(Boolean).join(' ')}>
      <thead>
        <tr>
          {keys.map((key) => (
            <th key={key} className="docs-list__header">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(list ?? []).map((row) => (
          <tr key={row.id} className="docs-list__row">
            {keys.map((key) => (
              <td key={key} className="docs-list__cell">
                {String(row[key as keyof DocsUser] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// The list resolves its body from a map of modes, so the implementation is
// registered under the mode that `options.mode` asks for. The map is merged
// over the built-in one, so the other modes keep their own components.
const listModeComponents = { [ListMode.desktop]: CustomList };

const users: DocsUser[] = [
  { id: '1', firstName: 'Jan', email: 'jan@example.com', role: 'Admin' },
  { id: '2', firstName: 'Anna', email: 'anna@example.com', role: 'User' },
  { id: '3', firstName: 'Piotr', email: 'piotr@example.com', role: 'User' },
];

export function ListCustomExample() {
  // The provider is the list's data source; a real application hands over
  // the rows and the loading flag of its store here.
  const options = useMemo<IListOptions<DocsUser>>(
    () => ({
      type: DocsUser,
      mode: ListMode.desktop,
      provider: { list: users, loading: false, getData: () => undefined },
    }),
    [],
  );

  return (
    <SmartProvider listModeComponents={listModeComponents}>
      <SmartList options={options} />
    </SmartProvider>
  );
}
// #endregion
