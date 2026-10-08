import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

import { Field, FieldType, IModelFilter, Model } from '@smartsoft001/models';

import { SmartCrudFilters } from './filters';
import { CrudFullConfig } from '../../crud.config';
import { useCrud } from '../../crud.context';
import { CrudProvider } from '../../crud.provider';
import { read } from '../../state/crud.actions';

// `IModelFilter.possibilities` is typed as an Angular signal; a function
// returning the list is what the React filters read.
const possibilities = (items: { id: string; text: string }[]) =>
  (() => items) as unknown as IModelFilter['possibilities'];

/**
 * Sample entity with several filterable fields, the same as in the Angular
 * `Smart-Crud/Filters` story: text, int, flag and date fields with
 * `list.filter`, and model-level radio and check filters.
 */
@Model({
  titleKey: 'title',
  filters: [
    {
      label: 'category',
      key: 'category',
      type: '=',
      fieldType: FieldType.radio,
      possibilities: possibilities([
        { id: 'news', text: 'News' },
        { id: 'blog', text: 'Blog' },
        { id: 'guide', text: 'Guide' },
      ]),
    },
    {
      label: 'tags',
      key: 'tags',
      type: '=',
      fieldType: FieldType.check,
      possibilities: possibilities([
        { id: 'angular', text: 'Angular' },
        { id: 'nestjs', text: 'NestJS' },
        { id: 'nx', text: 'Nx' },
      ]),
    },
  ],
})
class FilterableArticle {
  id!: string;

  @Field({ list: { filter: true } })
  title!: string;

  @Field({ list: { filter: true }, type: FieldType.int })
  views!: number;

  @Field({ list: { filter: true }, type: FieldType.flag })
  published!: boolean;

  @Field({ list: { filter: true }, type: FieldType.date })
  createdAt!: Date;
}

const config: CrudFullConfig<FilterableArticle> = {
  type: FilterableArticle,
  title: 'Article',
  entity: 'articles',
  pagination: { limit: 25 },
  apiUrl: 'http://207.180.210.142:1201/api/articles',
};

/**
 * The filter widgets wait for the feature's filter, which only a read sets;
 * in an application the list page issues it. The host replays that first
 * read, so typing into a widget re-reads with the new query.
 */
function FiltersStoryHost() {
  const { store } = useCrud<FilterableArticle>();

  useEffect(() => {
    store.dispatch(read('articles', { limit: 25, offset: 0, query: [] }));
  }, [store]);

  return (
    <div style={{ height: 600, width: 360, border: '1px solid #e5e7eb' }}>
      <SmartCrudFilters />
    </div>
  );
}

const meta: Meta = {
  title: 'Smart-Crud/Filters',
  component: SmartCrudFilters,
};

export default meta;
type Story = StoryObj;

/**
 * The filters panel rendered standalone, showing the filter widgets (text /
 * int / flag / date / radio / check) derived from the model above.
 */
export const Default: Story = {
  name: 'Composed filter widgets',
  render: () => (
    <CrudProvider config={config}>
      <FiltersStoryHost />
    </CrudProvider>
  ),
};
