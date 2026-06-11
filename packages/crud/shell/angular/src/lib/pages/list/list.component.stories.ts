import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { importProvidersFrom, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { NgrxSharedModule, SharedModule } from '@smartsoft001/angular';
import { Field, Model } from '@smartsoft001/models';

import { ListComponent } from './list.component';
import { CrudModule } from '../../crud.module';

@Component({
  template: ` <p>Test details</p> `,
  standalone: true,
})
export class TestDetailsComponent {}

@Model({})
export class Note {
  id!: string;

  @Field({ list: true })
  title!: string;

  @Field({ list: true })
  body!: string;
}

// Create a dedicated module for Storybook with proper NgRx setup
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CrudModule.forFeature({
      routing: true,
      config: {
        type: Note,
        title: 'Note',
        entity: 'notes',
        export: true,
        pagination: { limit: 25 },
        apiUrl: 'http://207.180.210.142:1201/api/notes',
      },
    }),
  ],
})
export class StorybookTestModule {}

/**
 * Root-level providers for the story application. NgRx must live at the
 * APPLICATION injector (not in `moduleMetadata` imports): `Actions`,
 * `EffectSources` and `EffectsRunner` are `providedIn: 'root'`, so they are
 * created in the root injector and must find `Store` there. `NgrxSharedModule`
 * connects the static `NgrxStoreService.store` that `CrudModule.forFeature`
 * uses to register the entity reducer. The real router replaces
 * `RouterTestingModule` (the `@angular/router/testing` entrypoint is not
 * bundleable in the Storybook preview); hash routing keeps `router.navigate`
 * from touching the iframe URL's story params.
 */
const storyAppConfig = applicationConfig({
  providers: [
    importProvidersFrom(
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      NgrxSharedModule,
      TranslateModule.forRoot(),
      RouterModule.forRoot([], { useHash: true }),
    ),
  ],
});

const meta: Meta<ListComponent<Note>> = {
  title: 'Smart-Crud/List Page',
  component: ListComponent,
  decorators: [
    storyAppConfig,
    moduleMetadata({
      imports: [StorybookTestModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<ListComponent<Note>>;

export const Export: Story = {
  name: 'With export',
  render: () => ({
    template: `
      <div style="height: 400px">
          <smart-crud-list-page></smart-crud-list-page>
      </div>
    `,
  }),
};

export const CustomDetails: Story = {
  name: 'Custom details',
  render: () => ({
    template: `
      <div style="height: 400px">
          <smart-crud-list-page></smart-crud-list-page>
      </div>
    `,
  }),
};
