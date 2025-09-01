import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { SharedModule } from '@smartsoft001/angular';
import { Field, Model } from '@smartsoft001/models';

import { CrudModule } from '../../crud.module';

@Component({
  template: ` <p>Test details</p> `,
})
export class TestDetailsComponent {}

@Model({})
export class Note {
  @Field({ list: true })
  title: string;

  @Field({ list: true })
  body: string;
}

const meta: Meta = {
  title: 'Smart-Crud/List Page',
  component: 'smart-crud-list-page',
  decorators: [
    moduleMetadata({
      declarations: [TestDetailsComponent],
      imports: [
        CommonModule,
        IonicModule.forRoot(),
        SharedModule,
        TranslateModule.forRoot(),
        RouterModule.forRoot([], { useHash: true }),
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
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Export: Story = {
  name: 'Z eksportem',
  render: () => ({
    template: `
      <div style="height: 400px">
          <smart-crud-list-page></smart-crud-list-page>
      </div>
    `,
  }),
};

export const CustomDetails: Story = {
  name: 'Niestandardowe szczegóły',
  render: () => ({
    template: `
      <div style="height: 400px">
          <smart-crud-list-page></smart-crud-list-page>
      </div>
    `,
  }),
};
