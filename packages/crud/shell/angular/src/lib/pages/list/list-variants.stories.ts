import { CommonModule } from '@angular/common';
import { NgModule, signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { PaginationMode, SharedModule } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { ListComponent } from './list.component';
import { CrudModule } from '../../crud.module';
import { ICrudListGroup } from '../../models';

/**
 * Model whose fields are flagged `list.filter` across several `FieldType`s, plus
 * a model-level `filters` array. This makes the list's "filters" end-button
 * appear and gives the `<smart-crud-filters>` panel composed widgets to render
 * (text / int / flag / radio / date).
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
      possibilities: signal([
        { id: 'news', text: 'News' },
        { id: 'blog', text: 'Blog' },
        { id: 'guide', text: 'Guide' },
      ]),
    },
  ],
})
export class FilterableArticle {
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

/** Plain model reused for groups / styling / sort+search variants. */
@Model({ titleKey: 'title' })
export class Note {
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

// ---- Filters variant -------------------------------------------------------

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SharedModule,
    TranslateModule.forRoot(),
    RouterTestingModule,
    CrudModule.forFeature({
      routing: true,
      config: {
        type: FilterableArticle,
        title: 'Articles (filterable)',
        entity: 'filterable-articles',
        pagination: { limit: 25 },
        apiUrl: 'http://207.180.210.142:1201/api/filterable-articles',
      },
    }),
  ],
})
export class FiltersStorybookModule {}

// ---- Groups variant --------------------------------------------------------

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SharedModule,
    TranslateModule.forRoot(),
    RouterTestingModule,
    CrudModule.forFeature({
      routing: true,
      config: {
        type: Note,
        title: 'Notes (grouped)',
        entity: 'grouped-notes',
        pagination: { limit: 25 },
        apiUrl: 'http://207.180.210.142:1201/api/grouped-notes',
        list: { groups: SAMPLE_GROUPS },
      },
    }),
  ],
})
export class GroupsStorybookModule {}

// ---- Styling variant -------------------------------------------------------

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SharedModule,
    TranslateModule.forRoot(),
    RouterTestingModule,
    CrudModule.forFeature({
      routing: true,
      config: {
        type: Note,
        title: 'Notes (styled)',
        entity: 'styled-notes',
        pagination: { limit: 25 },
        apiUrl: 'http://207.180.210.142:1201/api/styled-notes',
        // Tier-2 declarative styling surface — flows into <smart-page>.
        cssClass: 'smart:bg-slate-50',
        variant: 'standard',
      },
    }),
  ],
})
export class StylingStorybookModule {}

// ---- Sort + search variant -------------------------------------------------

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SharedModule,
    TranslateModule.forRoot(),
    RouterTestingModule,
    CrudModule.forFeature({
      routing: true,
      config: {
        type: Note,
        title: 'Notes (sort + search)',
        entity: 'searchable-notes',
        pagination: { limit: 25 },
        apiUrl: 'http://207.180.210.142:1201/api/searchable-notes',
        search: true,
        sort: { default: 'title', defaultDesc: false },
      },
    }),
  ],
})
export class SortSearchStorybookModule {}

// ---- CRUD actions variant --------------------------------------------------
// Enables add / edit / remove so the list renders the add end-button and the
// per-row edit (→) and remove affordances. The e2e suite asserts these render
// and that `remove` is wired; the deeper add/edit form submit and the delete
// confirm are documented as deferred (no item route in Storybook; AlertService
// is a no-op stub, so the delete confirm never fires DELETE).

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SharedModule,
    TranslateModule.forRoot(),
    RouterTestingModule,
    CrudModule.forFeature({
      routing: true,
      config: {
        type: Note,
        title: 'Notes (with actions)',
        entity: 'action-notes',
        pagination: { limit: 25 },
        apiUrl: 'http://207.180.210.142:1201/api/action-notes',
        add: true,
        edit: true,
        remove: true,
      },
    }),
  ],
})
export class ActionsStorybookModule {}

// ---- Single-page pagination variant ---------------------------------------
// `paginationMode: singlePage` makes the desktop list render the
// `<smart-paging-standard>` control (prev / numbered / next buttons), which the
// e2e suite drives to assert that next/prev advance the offset query param.

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SharedModule,
    TranslateModule.forRoot(),
    RouterTestingModule,
    CrudModule.forFeature({
      routing: true,
      config: {
        type: Note,
        title: 'Notes (paged)',
        entity: 'paged-notes',
        pagination: { limit: 25 },
        apiUrl: 'http://207.180.210.142:1201/api/paged-notes',
        list: { paginationMode: PaginationMode.singlePage },
      },
    }),
  ],
})
export class PaginationStorybookModule {}

const meta: Meta<ListComponent<Note>> = {
  title: 'Smart-Crud/List Page Variants',
  component: ListComponent,
};

export default meta;
type Story = StoryObj<ListComponent<Note>>;

const listTemplate = `
  <div style="height: 500px">
      <smart-crud-list-page></smart-crud-list-page>
  </div>
`;

export const WithFilters: Story = {
  name: 'With filters',
  decorators: [moduleMetadata({ imports: [FiltersStorybookModule] })],
  render: () => ({ template: listTemplate }),
};

export const WithGroups: Story = {
  name: 'With groups',
  decorators: [moduleMetadata({ imports: [GroupsStorybookModule] })],
  render: () => ({ template: listTemplate }),
};

export const WithStyling: Story = {
  name: 'With styling (cssClass + variant)',
  decorators: [moduleMetadata({ imports: [StylingStorybookModule] })],
  render: () => ({ template: listTemplate }),
};

export const WithSortAndSearch: Story = {
  name: 'With sort + search',
  decorators: [moduleMetadata({ imports: [SortSearchStorybookModule] })],
  render: () => ({ template: listTemplate }),
};

export const WithPagination: Story = {
  name: 'With single-page pagination',
  decorators: [moduleMetadata({ imports: [PaginationStorybookModule] })],
  render: () => ({ template: listTemplate }),
};

export const WithActions: Story = {
  name: 'With add / edit / remove',
  decorators: [moduleMetadata({ imports: [ActionsStorybookModule] })],
  render: () => ({ template: listTemplate }),
};
