import { CommonModule } from '@angular/common';
import { NgModule, signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { SharedModule } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { FiltersComponent } from './filters.component';
import { CrudModule } from '../../crud.module';

/**
 * Sample entity with several filterable fields so the standalone filters panel
 * composes a representative set of filter widgets:
 *  - text  -> field `title` (`list.filter`)
 *  - int   -> field `views` (`list.filter`)
 *  - flag  -> field `published` (`list.filter`)
 *  - date  -> field `createdAt` (`list.filter`)
 *  - radio -> model-level `filters[].fieldType = radio` with `possibilities`
 *  - check -> model-level `filters[].fieldType = check` with `possibilities`
 */
@Model({
  titleKey: 'title',
  filters: [
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
    {
      label: 'tags',
      key: 'tags',
      type: '=',
      fieldType: FieldType.check,
      possibilities: signal([
        { id: 'angular', text: 'Angular' },
        { id: 'nestjs', text: 'NestJS' },
        { id: 'nx', text: 'Nx' },
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

  @Field({ list: { filter: true }, type: FieldType.date })
  createdAt!: Date;
}

// Dedicated Storybook module mirroring the list story's `StorybookTestModule`.
// The model above drives the composed filter widgets; the placeholder apiUrl
// renders chrome without a live backend.
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
        title: 'Article',
        entity: 'articles',
        pagination: { limit: 25 },
        apiUrl: 'http://207.180.210.142:1201/api/articles',
      },
    }),
  ],
})
export class StorybookTestModule {}

const meta: Meta<FiltersComponent<FilterableArticle>> = {
  title: 'Smart-Crud/Filters',
  component: FiltersComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookTestModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<FiltersComponent<FilterableArticle>>;

/**
 * The filters panel rendered standalone, showing the composed filter widgets
 * (text / int / flag / date / radio / check) derived from the model above.
 */
export const Default: Story = {
  name: 'Composed filter widgets',
  render: () => ({
    template: `
      <div style="height: 600px; width: 360px; border: 1px solid #e5e7eb">
          <smart-crud-filters></smart-crud-filters>
      </div>
    `,
  }),
};
