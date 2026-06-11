import { CommonModule } from '@angular/common';
import {
  Component,
  importProvidersFrom,
  inject,
  NgModule,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { NgrxSharedModule, SharedModule } from '@smartsoft001/angular';
import { Field, Model } from '@smartsoft001/models';

import { ExportComponent } from './export.component';
import { readSuccess } from '../../+state/crud.actions';
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
    SharedModule,
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

/**
 * Story host. The standalone story never runs a list read, so the
 * `export-notes` slice would stay `loaded: false` and the export buttons —
 * whose `IButtonOptions.loading` is `facade.loading` — would render disabled
 * forever. Dispatching `readSuccess` marks the slice loaded, exactly as in a
 * real app where the list page has read data before the export popover opens.
 */
@Component({
  selector: 'smart-story-export-host',
  template: `
    <div style="width: 240px; border: 1px solid #e5e7eb">
      <smart-crud-export></smart-crud-export>
    </div>
  `,
  imports: [ExportComponent],
})
export class ExportStoryHostComponent implements OnInit {
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(
      readSuccess('export-notes', null, {
        data: [],
        totalCount: 0,
        links: null,
      }),
    );
  }
}

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

const meta: Meta<ExportComponent<Note>> = {
  title: 'Smart-Crud/Export',
  component: ExportComponent,
  decorators: [
    storyAppConfig,
    moduleMetadata({
      imports: [ExportStorybookModule, ExportStoryHostComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<ExportComponent<Note>>;

export const Default: Story = {
  name: 'CSV / XLSX buttons',
  render: () => ({
    template: `<smart-story-export-host></smart-story-export-host>`,
  }),
};
