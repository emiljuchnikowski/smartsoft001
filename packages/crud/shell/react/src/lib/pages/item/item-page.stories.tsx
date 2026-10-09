import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartCrudItemPage } from './item-page';
import { CrudFullConfig } from '../../crud.config';
import { CrudProvider } from '../../crud.provider';

/**
 * Sample entity for the item page stories: text, long text, int and flag
 * fields, so the form renders a representative set of inputs.
 */
@Model({ titleKey: 'title' })
class Article {
  id!: string;

  @Field({ create: true, update: true, details: true })
  title!: string;

  @Field({
    create: true,
    update: true,
    details: true,
    type: FieldType.longText,
  })
  body!: string;

  @Field({ create: true, update: true, details: true, type: FieldType.int })
  views!: number;

  @Field({ create: true, update: true, details: true, type: FieldType.flag })
  published!: boolean;
}

const config: CrudFullConfig<Article> = {
  type: Article,
  title: 'Article',
  entity: 'articles',
  add: true,
  edit: true,
  details: true,
  pagination: { limit: 25 },
  apiUrl: 'http://207.180.210.142:1201/api/articles',
};

const meta: Meta = {
  title: 'Smart-Crud/Item Page',
  component: SmartCrudItemPage,
};

export default meta;
type Story = StoryObj;

/** "Add" mode, the create form: the page creates when it has no `id`. */
export const Add: Story = {
  name: 'Add (create form)',
  render: () => (
    <CrudProvider config={config}>
      <div style={{ height: 600 }}>
        <SmartCrudItemPage />
      </div>
    </CrudProvider>
  ),
};

// The edit and details modes have no story: both load the item by id from
// the API, which Storybook does not have.
