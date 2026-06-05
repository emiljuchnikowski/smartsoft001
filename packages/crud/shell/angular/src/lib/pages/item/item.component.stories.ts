import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { SharedModule } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { ItemComponent } from './item.component';
import { CrudModule } from '../../crud.module';

/**
 * Sample entity for the item-page stories. Several `@Field` types are present
 * (text, longText, int, flag) so the add/edit form renders a representative set
 * of inputs.
 */
@Model({ titleKey: 'title' })
export class Article {
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

// Dedicated Storybook module mirroring the list story's `StorybookTestModule`.
// `RouterTestingModule.withRoutes` provides an `/add` route so the item page can
// resolve its "create" mode from `router.routerState.snapshot.url` (it checks
// for a URL ending in `/add`). The placeholder apiUrl renders chrome without a
// live backend.
@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SharedModule,
    TranslateModule.forRoot(),
    RouterTestingModule.withRoutes([
      { path: 'articles/add', component: ItemComponent },
    ]),
    CrudModule.forFeature({
      routing: true,
      config: {
        type: Article,
        title: 'Article',
        entity: 'articles',
        add: true,
        edit: true,
        details: true,
        pagination: { limit: 25 },
        apiUrl: 'http://207.180.210.142:1201/api/articles',
      },
    }),
  ],
})
export class StorybookTestModule {}

const meta: Meta<ItemComponent<Article>> = {
  title: 'Smart-Crud/Item Page',
  component: ItemComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookTestModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<ItemComponent<Article>>;

/**
 * "Add" mode — the create form. The item page enters create mode when the route
 * URL ends in `/add`, which `RouterTestingModule.withRoutes` above provides.
 */
export const Add: Story = {
  name: 'Add (create form)',
  render: () => ({
    template: `
      <div style="height: 600px">
          <smart-crud-item-page></smart-crud-item-page>
      </div>
    `,
  }),
};

// NOTE: Edit and Details modes are intentionally not shipped as stories.
// Both resolve an id from the route (`activeRoute.params`) and then call
// `facade.select(id)` to load the selected item from the API. Without a live
// backend the selected item never resolves, so the form/details body cannot be
// populated meaningfully in Storybook. They require the running CRUD API.
