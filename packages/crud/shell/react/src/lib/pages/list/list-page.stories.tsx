import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, Model } from '@smartsoft001/models';

import { SmartCrudListPage } from './list-page';
import { CrudFullConfig } from '../../crud.config';
import { CrudProvider } from '../../crud.provider';

@Model({})
class Note {
  id!: string;

  @Field({ list: true })
  title!: string;

  @Field({ list: true })
  body!: string;
}

const config: CrudFullConfig<Note> = {
  type: Note,
  title: 'Note',
  entity: 'notes',
  export: true,
  pagination: { limit: 25 },
  apiUrl: 'http://207.180.210.142:1201/api/notes',
};

const meta: Meta = {
  title: 'Smart-Crud/List Page',
  component: SmartCrudListPage,
};

export default meta;
type Story = StoryObj;

const ListPage = () => (
  <CrudProvider config={config}>
    <div style={{ height: 400 }}>
      <SmartCrudListPage />
    </div>
  </CrudProvider>
);

export const Export: Story = {
  name: 'With export',
  render: () => <ListPage />,
};

export const CustomDetails: Story = {
  name: 'Custom details',
  render: () => <ListPage />,
};
