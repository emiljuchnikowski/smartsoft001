import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { IAddress } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SharedFactoriesModule } from '../../factories';
import { FileService } from '../../services';
import {
  DETAILS_COMPONENT_TOKEN,
  DETAILS_STANDARD_COMPONENT_TOKEN,
} from '../../shared.inectors';
import { COMPONENTS, IMPORTS } from '../components.module';
import { DetailsBaseComponent } from './base/base.component';
import { DetailsComponent } from './details.component';

const meta: Meta<DetailsComponent<any>> = {
  title: 'Smart-Details/Details',
  component: DetailsComponent,
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
            getUrl: (id: string) => `https://picsum.photos/seed/${id}/150/150`,
            download: (id: string) => console.log('[storybook] download', id),
            upload: () => undefined,
            delete: () => Promise.resolve(),
          },
        },
        { provide: DETAILS_COMPONENT_TOKEN, useValue: DetailsComponent },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<DetailsComponent<any>>;

const LOGO_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="#6366f1"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="white" font-family="sans-serif" font-size="24" font-weight="bold">LOGO</text></svg>`,
  );

@Model({})
class NestedUserModel {
  @Field({ details: true })
  firstName = 'Jan';

  @Field({ details: true })
  lastName = 'Kowalski';
}

// ─── 1. Text only ───────────────────────────────────────────────────────────

export const TextOnly: Story = {
  name: 'Text only',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.text })
            firstName = 'Jan';

            @Field({ details: true, type: FieldType.text })
            lastName = 'Kowalski';
          }
          return TestModel;
        })(),
        item: signal({ firstName: 'Jan', lastName: 'Kowalski' }),
      },
    },
    template: `
      <smart-details [options]="{ type: storyOptions.type, item: storyOptions.item }"></smart-details>
    `,
  }),
};

// ─── 2. Address ─────────────────────────────────────────────────────────────

export const Address: Story = {
  name: 'Address',
  render: () => {
    const addressValue: IAddress = {
      city: 'Warszawa',
      street: 'Marszałkowska',
      zipCode: '00-001',
      flatNumber: '5',
      buildingNumber: '3B',
    };
    return {
      props: {
        storyOptions: {
          type: (() => {
            @Model({})
            class TestModel {
              @Field({ details: true, type: FieldType.address })
              address: IAddress = addressValue;
            }
            return TestModel;
          })(),
          item: signal({ address: addressValue }),
        },
      },
      template: `
        <smart-details [options]="{ type: storyOptions.type, item: storyOptions.item }"></smart-details>
      `,
    };
  },
};

// ─── 3. With nested object ──────────────────────────────────────────────────

export const ObjectField: Story = {
  name: 'Nested object',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true })
            title = 'Employee';

            @Field({ details: true, type: FieldType.object })
            user = new NestedUserModel();
          }
          return TestModel;
        })(),
        item: signal({
          title: 'Employee',
          user: Object.assign(new NestedUserModel(), {
            firstName: 'Jan',
            lastName: 'Kowalski',
          }),
        }),
      },
    },
    template: `
      <smart-details [options]="{ type: storyOptions.type, item: storyOptions.item }"></smart-details>
    `,
  }),
};

// ─── 4. With CSS class ──────────────────────────────────────────────────────

export const WithCssClass: Story = {
  name: 'With CSS class',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.text })
            note = 'Highlighted with custom container class';
          }
          return TestModel;
        })(),
        item: signal({ note: 'Highlighted with custom container class' }),
      },
    },
    template: `
      <smart-details
        class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
        [options]="{ type: storyOptions.type, item: storyOptions.item }"
      ></smart-details>
    `,
  }),
};

// ─── 5. All field types ─────────────────────────────────────────────────────

export const AllFields: Story = {
  name: 'All field types',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.text })
            label = 'Lorem ipsum dolor sit amet';

            @Field({ details: true, type: FieldType.email })
            email = 'user@example.com';

            @Field({ details: true, type: FieldType.enum })
            status = 'active';

            @Field({ details: true, type: FieldType.flag })
            isActive = true;

            @Field({ details: true, type: FieldType.color })
            color = '#4f46e5';

            @Field({ details: true, type: FieldType.address })
            address: IAddress = {
              city: 'Warszawa',
              street: 'Marszałkowska',
              zipCode: '00-001',
              flatNumber: '5',
              buildingNumber: '3B',
            };

            @Field({ details: true, type: FieldType.phoneNumberPl })
            phone = '600700800';

            @Field({ details: true, type: FieldType.dateRange })
            range = { start: '2026-01-01', end: '2026-01-31' };

            @Field({ details: true, type: FieldType.image })
            photo: any = { id: 'abc' };

            @Field({ details: true, type: FieldType.logo })
            logo = LOGO_DATA_URI;

            @Field({ details: true, type: FieldType.attachment })
            file: any = { id: 'doc' };

            @Field({ details: true, type: FieldType.pdf })
            brochure: any = { id: 'brochure' };

            @Field({ details: true, type: FieldType.object })
            user = new NestedUserModel();
          }
          return TestModel;
        })(),
        item: signal({
          label: 'Lorem ipsum dolor sit amet',
          email: 'user@example.com',
          status: 'active',
          isActive: true,
          color: '#4f46e5',
          address: {
            city: 'Warszawa',
            street: 'Marszałkowska',
            zipCode: '00-001',
            flatNumber: '5',
            buildingNumber: '3B',
          },
          phone: '600700800',
          range: { start: '2026-01-01', end: '2026-01-31' },
          photo: { id: 'abc' },
          logo: LOGO_DATA_URI,
          file: { id: 'doc' },
          brochure: { id: 'brochure' },
          user: Object.assign(new NestedUserModel(), {
            firstName: 'Jan',
            lastName: 'Kowalski',
          }),
        }),
      },
    },
    template: `
      <smart-details [options]="{ type: storyOptions.type, item: storyOptions.item }"></smart-details>
    `,
  }),
};

// ─── 6. Custom via token ────────────────────────────────────────────────────

@Component({
  selector: 'custom-details-impl',
  template: `
    <div
      class="smart:rounded-md smart:border smart:border-indigo-300 smart:bg-indigo-50 smart:p-4 smart:dark:border-indigo-700 smart:dark:bg-indigo-900/40"
    >
      <p
        class="smart:font-semibold smart:text-indigo-900 smart:dark:text-indigo-100"
      >
        Custom details implementation injected via
        DETAILS_STANDARD_COMPONENT_TOKEN
      </p>
      @for (field of fields; track field.key) {
        <p
          class="smart:mt-2 smart:text-sm smart:text-indigo-700 smart:dark:text-indigo-300"
        >
          {{ field.key }}: {{ item?.()?.[field.key] }}
        </p>
      }
    </div>
  `,
  standalone: true,
})
class CustomDetailsImplComponent extends DetailsBaseComponent<any> {}

export const CustomViaToken: Story = {
  name: 'Custom via DETAILS_STANDARD_COMPONENT_TOKEN',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true })
            firstName = 'Jan';

            @Field({ details: true })
            lastName = 'Kowalski';
          }
          return TestModel;
        })(),
        item: signal({ firstName: 'Jan', lastName: 'Kowalski' }),
      },
    },
    template: `
      <smart-details [options]="{ type: storyOptions.type, item: storyOptions.item }"></smart-details>
    `,
    moduleMetadata: {
      providers: [
        {
          provide: DETAILS_STANDARD_COMPONENT_TOKEN,
          useValue: CustomDetailsImplComponent,
        },
      ],
    },
  }),
};
