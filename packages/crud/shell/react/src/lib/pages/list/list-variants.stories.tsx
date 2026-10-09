import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, FieldType, IModelFilter, Model } from '@smartsoft001/models';
import { PaginationMode } from '@smartsoft001/react';

import { SmartCrudListPage } from './list-page';
import { CrudFullConfig } from '../../crud.config';
import { CrudProvider } from '../../crud.provider';
import { ICrudListGroup } from '../../models';

// The filters read `IModelFilter.possibilities` as a function returning the
// list.
const possibilities = (items: { id: string; text: string }[]) =>
  (() => items) as unknown as IModelFilter['possibilities'];

/**
 * Model whose fields are flagged `list.filter` across several `FieldType`s,
 * plus a model-level `filters` array, so the list shows the filters button
 * and the panel has widgets to render.
 */
@Model({
  titleKey: 'title',
  filters: [
    {
      label: 'fromDate',
      key: 'createdAt',
      type: '<=',
      fieldType: FieldType.dateWithEdit,
    },
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

  @Field({ list: true, type: FieldType.date })
  createdAt!: Date;
}

/** Plain model reused for the groups / styling / sort + search variants. */
@Model({ titleKey: 'title' })
class Note {
  id!: string;

  @Field({ list: true, search: true })
  title!: string;

  @Field({ list: true })
  body!: string;

  @Field({ list: true, type: FieldType.int })
  priority!: number;
}

const SAMPLE_GROUPS: Array<ICrudListGroup> = [
  { key: 'priority', value: '1', text: 'High priority' },
  { key: 'priority', value: '2', text: 'Normal priority' },
  { key: 'priority', value: '3', text: 'Low priority' },
];

const API = 'http://207.180.210.142:1201/api';

const FILTERS: CrudFullConfig<FilterableArticle> = {
  type: FilterableArticle,
  title: 'Articles (filterable)',
  entity: 'filterable-articles',
  pagination: { limit: 25 },
  apiUrl: `${API}/filterable-articles`,
};

const GROUPS: CrudFullConfig<Note> = {
  type: Note,
  title: 'Notes (grouped)',
  entity: 'grouped-notes',
  pagination: { limit: 25 },
  apiUrl: `${API}/grouped-notes`,
  list: { groups: SAMPLE_GROUPS },
};

const STYLING: CrudFullConfig<Note> = {
  type: Note,
  title: 'Notes (styled)',
  entity: 'styled-notes',
  pagination: { limit: 25 },
  apiUrl: `${API}/styled-notes`,
  // The declarative styling surface, passed on to `SmartPage`.
  className: 'smart:bg-slate-50',
  variant: 'standard',
};

const SORT_SEARCH: CrudFullConfig<Note> = {
  type: Note,
  title: 'Notes (sort + search)',
  entity: 'searchable-notes',
  pagination: { limit: 25 },
  apiUrl: `${API}/searchable-notes`,
  search: true,
  sort: { default: 'title', defaultDesc: false },
};

// `paginationMode: singlePage` renders the paging control (prev / numbered /
// next) under the desktop list.
const PAGINATION: CrudFullConfig<Note> = {
  type: Note,
  title: 'Notes (paged)',
  entity: 'paged-notes',
  pagination: { limit: 25 },
  apiUrl: `${API}/paged-notes`,
  list: { paginationMode: PaginationMode.singlePage },
};

// Add / edit / remove: the add button and the per-row edit and remove
// actions.
const ACTIONS: CrudFullConfig<Note> = {
  type: Note,
  title: 'Notes (with actions)',
  entity: 'action-notes',
  pagination: { limit: 25 },
  apiUrl: `${API}/action-notes`,
  add: true,
  edit: true,
  remove: true,
};

const meta: Meta = {
  title: 'Smart-Crud/List Page Variants',
  component: SmartCrudListPage,
};

export default meta;
type Story = StoryObj;

const renderList = (config: CrudFullConfig<any>) => () => (
  <CrudProvider config={config}>
    <div style={{ height: 500 }}>
      <SmartCrudListPage />
    </div>
  </CrudProvider>
);

export const WithFilters: Story = {
  name: 'With filters',
  render: renderList(FILTERS),
};

export const WithGroups: Story = {
  name: 'With groups',
  render: renderList(GROUPS),
};

export const WithStyling: Story = {
  name: 'With styling (cssClass + variant)',
  render: renderList(STYLING),
};

export const WithSortAndSearch: Story = {
  name: 'With sort + search',
  render: renderList(SORT_SEARCH),
};

export const WithPagination: Story = {
  name: 'With single-page pagination',
  render: renderList(PAGINATION),
};

export const WithActions: Story = {
  name: 'With add / edit / remove',
  render: renderList(ACTIONS),
};
