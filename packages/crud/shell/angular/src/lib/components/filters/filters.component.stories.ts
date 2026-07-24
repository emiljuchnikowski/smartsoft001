import { CommonModule } from '@angular/common';
import {
  Component,
  importProvidersFrom,
  inject,
  NgModule,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { NgrxSharedModule, SharedModule } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { FiltersComponent } from './filters.component';
import { read } from '../../+state/crud.actions';
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
    SharedModule,
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

/**
 * Story host. The filter widgets early-return from `refresh()` while
 * `facade.filter()` is undefined, and only a `[articles] Read` dispatch seeds
 * that state — in a real app the list page issues it on init. The host
 * replays that initial read (its HTTP GET is stubbed by the e2e intercepts,
 * exactly like the list-page stories) so typing into a widget re-reads with
 * the new query param.
 */
@Component({
  selector: 'smart-story-filters-host',
  template: `
    <div style="height: 600px; width: 360px; border: 1px solid #e5e7eb">
      <smart-crud-filters></smart-crud-filters>
    </div>
  `,
  imports: [FiltersComponent],
})
export class FiltersStoryHostComponent implements OnInit {
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(read('articles', { limit: 25, offset: 0, query: [] }));
  }
}

const meta: Meta<FiltersComponent<FilterableArticle>> = {
  title: 'Smart-Crud/Filters',
  component: FiltersComponent,
  decorators: [
    storyAppConfig,
    moduleMetadata({
      imports: [StorybookTestModule, FiltersStoryHostComponent],
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
    template: `<smart-story-filters-host></smart-story-filters-host>`,
  }),
};
