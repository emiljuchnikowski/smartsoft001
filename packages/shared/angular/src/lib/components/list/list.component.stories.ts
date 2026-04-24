import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { ListComponent } from './list.component';
import { SharedFactoriesModule } from '../../factories';
import { IListOptions, IListProvider, ListMode } from '../../models';
import { FileService } from '../../services';
import { LIST_MODE_COMPONENTS_TOKEN } from '../../shared.inectors';
import { COMPONENTS, IMPORTS } from '../components.module';
import { ListBaseComponent } from './base/base.component';

// ─── Shared test data ────────────────────────────────────────────────────────

@Model({})
class UserListModel implements IEntity<string> {
  id = '1';

  @Field({ list: true, type: FieldType.text })
  firstName = 'Jan';

  @Field({ list: true, type: FieldType.email })
  email = 'jan@example.com';

  @Field({ list: true, type: FieldType.text })
  role = 'Admin';
}

const buildProvider = (): IListProvider<UserListModel> => ({
  list: signal([
    {
      id: '1',
      firstName: 'Jan',
      email: 'jan@example.com',
      role: 'Admin',
    } as UserListModel,
    {
      id: '2',
      firstName: 'Anna',
      email: 'anna@example.com',
      role: 'User',
    } as UserListModel,
    {
      id: '3',
      firstName: 'Piotr',
      email: 'piotr@example.com',
      role: 'User',
    } as UserListModel,
  ]),
  loading: signal(false),
  getData: () => undefined,
});

const buildOptions = (mode?: ListMode): IListOptions<UserListModel> => ({
  provider: buildProvider(),
  type: UserListModel,
  mode,
});

// ─── Masonry test data (with image field) ─────────────────────────────────────

@Model({})
class PhotoListModel implements IEntity<string> {
  id = '1';

  @Field({ list: true, type: FieldType.text })
  title = 'Photo';

  @Field({ list: true, type: FieldType.image })
  image: any = { id: 'abc' };
}

const buildMasonryProvider = (): IListProvider<PhotoListModel> => ({
  list: signal([
    { id: '1', title: 'Mountain', image: { id: 'mountain' } } as PhotoListModel,
    { id: '2', title: 'Forest', image: { id: 'forest' } } as PhotoListModel,
    { id: '3', title: 'Ocean', image: { id: 'ocean' } } as PhotoListModel,
    { id: '4', title: 'Desert', image: { id: 'desert' } } as PhotoListModel,
    { id: '5', title: 'City', image: { id: 'city' } } as PhotoListModel,
    { id: '6', title: 'River', image: { id: 'river' } } as PhotoListModel,
  ]),
  loading: signal(false),
  getData: () => undefined,
});

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<ListComponent<any>> = {
  title: 'Smart-List/List',
  component: ListComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ...IMPORTS,
        ...COMPONENTS,
        SharedFactoriesModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: FileService,
          useValue: {
            getUrl: (id: string) => `https://picsum.photos/seed/${id}/400/300`,
            download: (id: string) => console.log('[storybook] download', id),
            upload: () => undefined,
            delete: () => Promise.resolve(),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ListComponent<any>>;

// ─── 1. Desktop ───────────────────────────────────────────────────────────────

export const Desktop: Story = {
  name: 'Desktop',
  render: () => ({
    props: {
      storyOptions: buildOptions(ListMode.desktop),
    },
    template: `<smart-list [options]="storyOptions"></smart-list>`,
  }),
};

// ─── 2. Mobile ────────────────────────────────────────────────────────────────

export const Mobile: Story = {
  name: 'Mobile',
  render: () => ({
    props: {
      storyOptions: buildOptions(ListMode.mobile),
    },
    template: `<smart-list [options]="storyOptions"></smart-list>`,
  }),
};

// ─── 3. MasonryGrid ───────────────────────────────────────────────────────────

export const MasonryGrid: Story = {
  name: 'Masonry Grid',
  render: () => ({
    props: {
      storyOptions: {
        provider: buildMasonryProvider(),
        type: PhotoListModel,
        mode: ListMode.masonryGrid,
      } as IListOptions<PhotoListModel>,
    },
    template: `<smart-list [options]="storyOptions"></smart-list>`,
  }),
};

// ─── 4. WithCssClass ──────────────────────────────────────────────────────────

export const WithCssClass: Story = {
  name: 'With CSS class',
  render: () => ({
    props: {
      storyOptions: buildOptions(ListMode.desktop),
    },
    template: `
      <smart-list
        class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
        [options]="storyOptions"
      ></smart-list>
    `,
  }),
};

// ─── 5. CustomViaToken ────────────────────────────────────────────────────────

@Component({
  selector: 'custom-list-impl',
  standalone: true,
  imports: [],
  template: `
    <div
      class="smart:rounded-md smart:border smart:border-indigo-300 smart:bg-indigo-50 smart:p-4 smart:dark:border-indigo-700 smart:dark:bg-indigo-900/40"
    >
      <p
        class="smart:font-semibold smart:text-indigo-900 smart:dark:text-indigo-100"
      >
        Custom list implementation injected via LIST_MODE_COMPONENTS_TOKEN
      </p>
      <p
        class="smart:mt-2 smart:text-sm smart:text-indigo-700 smart:dark:text-indigo-300"
      >
        This custom variant is active and rendered in place of the default
        desktop component.
      </p>
    </div>
  `,
})
class CustomListImplComponent extends ListBaseComponent<any> {}

export const CustomViaToken: Story = {
  name: 'Custom via LIST_MODE_COMPONENTS_TOKEN',
  render: () => ({
    props: {
      storyOptions: buildOptions(ListMode.desktop),
    },
    template: `<smart-list [options]="storyOptions"></smart-list>`,
    moduleMetadata: {
      imports: [CustomListImplComponent],
      providers: [
        {
          provide: LIST_MODE_COMPONENTS_TOKEN,
          useValue: {
            [ListMode.desktop]: CustomListImplComponent,
          },
        },
      ],
    },
  }),
};
