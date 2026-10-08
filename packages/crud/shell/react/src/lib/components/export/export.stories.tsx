import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

import { Field, Model } from '@smartsoft001/models';

import { SmartCrudExport } from './export';
import { CrudFullConfig } from '../../crud.config';
import { useCrud } from '../../crud.context';
import { CrudProvider } from '../../crud.provider';
import { readSuccess } from '../../state/crud.actions';

/**
 * Standalone story for the export popover body (`SmartCrudExport`): the
 * CSV / XLSX buttons rendered directly, so their export GET can be
 * exercised.
 */
@Model({})
class Note {
  id!: string;

  @Field({ list: true })
  title!: string;
}

const config: CrudFullConfig<Note> = {
  type: Note,
  title: 'Notes (export)',
  entity: 'export-notes',
  export: true,
  pagination: { limit: 25 },
  apiUrl: 'http://207.180.210.142:1201/api/export-notes',
};

/**
 * The standalone story never reads the list, so the slice would stay
 * `loaded: false` and the buttons, whose `loading` follows the facade, would
 * stay disabled. A `readSuccess` marks it loaded, as the list page's read
 * does in a real application.
 */
function ExportStoryHost() {
  const { store } = useCrud<Note>();

  useEffect(() => {
    store.dispatch(
      readSuccess('export-notes', null, {
        data: [],
        totalCount: 0,
        links: null,
      }),
    );
  }, [store]);

  return (
    <div style={{ width: 240, border: '1px solid #e5e7eb' }}>
      <SmartCrudExport />
    </div>
  );
}

const meta: Meta = {
  title: 'Smart-Crud/Export',
  component: SmartCrudExport,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'CSV / XLSX buttons',
  render: () => (
    <CrudProvider config={config}>
      <ExportStoryHost />
    </CrudProvider>
  ),
};
