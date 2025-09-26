import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { SharedModule } from '@smartsoft001/angular';
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
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SharedModule,
    TranslateModule.forRoot(),
    RouterTestingModule,
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

const meta: Meta<ListComponent<Note>> = {
  title: 'Smart-Crud/List Page',
  component: ListComponent,
  decorators: [
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
