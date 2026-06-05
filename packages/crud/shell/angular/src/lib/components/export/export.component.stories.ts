import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { SharedModule } from '@smartsoft001/angular';
import { Field, Model } from '@smartsoft001/models';

import { ExportComponent } from './export.component';
import { CrudModule } from '../../crud.module';

/**
 * Standalone story for the export popover body (`<smart-crud-export>`).
 *
 * Rendered directly (mirroring the standalone `Smart-Crud/Filters` story)
 * because the list page wires the export end-button as a `type: 'popover'`
 * button, but `smart-page-standard` does not currently mount popover bodies — so
 * the CSV / XLSX buttons are not reachable from the list story. This story
 * exposes them directly so their export GET (csv/xlsx Content-Type, no
 * offset/limit) can be exercised.
 */
@Model({})
export class Note {
  id!: string;

  @Field({ list: true })
  title!: string;
}

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SharedModule,
    TranslateModule.forRoot(),
    RouterModule.forRoot([]),
    CrudModule.forFeature({
      routing: true,
      config: {
        type: Note,
        title: 'Notes (export)',
        entity: 'export-notes',
        export: true,
        pagination: { limit: 25 },
        apiUrl: 'http://207.180.210.142:1201/api/export-notes',
      },
    }),
  ],
})
export class ExportStorybookModule {}

const meta: Meta<ExportComponent<Note>> = {
  title: 'Smart-Crud/Export',
  component: ExportComponent,
  decorators: [
    moduleMetadata({
      imports: [ExportStorybookModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<ExportComponent<Note>>;

export const Default: Story = {
  name: 'CSV / XLSX buttons',
  render: () => ({
    template: `
      <div style="width: 240px; border: 1px solid #e5e7eb">
          <smart-crud-export></smart-crud-export>
      </div>
    `,
  }),
};
