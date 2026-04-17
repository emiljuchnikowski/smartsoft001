import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { IAddress } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SharedFactoriesModule } from '../../factories';
import { DETAIL_FIELD_COMPONENTS_TOKEN } from '../../shared.inectors';
import { COMPONENTS, IMPORTS } from '../components.module';
import { DetailBaseComponent } from './base/base.component';
import { DetailComponent } from './detail.component';

const meta: Meta<DetailComponent<any>> = {
  title: 'Smart-Detail/Detail',
  component: DetailComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ...IMPORTS,
        ...COMPONENTS,
        SharedFactoriesModule,
        TranslateModule.forRoot(),
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<DetailComponent<any>>;

// ─── 1. Text ────────────────────────────────────────────────────────────────

export const Text: Story = {
  name: 'Text',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.text })
            label = 'Lorem ipsum dolor sit amet';
          }
          return TestModel;
        })(),
        options: {
          key: 'label',
          item: signal({ label: 'Lorem ipsum dolor sit amet' }),
          options: { type: FieldType.text },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 2. Email ───────────────────────────────────────────────────────────────

export const Email: Story = {
  name: 'Email',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.email })
            email = 'user@example.com';
          }
          return TestModel;
        })(),
        options: {
          key: 'email',
          item: signal({ email: 'user@example.com' }),
          options: { type: FieldType.email },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 3. Enum ────────────────────────────────────────────────────────────────

export const Enum: Story = {
  name: 'Enum',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.enum })
            status = 'active';
          }
          return TestModel;
        })(),
        options: {
          key: 'status',
          item: signal({ status: 'active' }),
          options: { type: FieldType.enum },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 4. Flag (on) ───────────────────────────────────────────────────────────

export const FlagOn: Story = {
  name: 'Flag — On',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.flag })
            isActive = true;
          }
          return TestModel;
        })(),
        options: {
          key: 'isActive',
          item: signal({ isActive: true }),
          options: { type: FieldType.flag },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 5. Flag (off) ──────────────────────────────────────────────────────────

export const FlagOff: Story = {
  name: 'Flag — Off',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.flag })
            isActive = false;
          }
          return TestModel;
        })(),
        options: {
          key: 'isActive',
          item: signal({ isActive: false }),
          options: { type: FieldType.flag },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 6. Color ───────────────────────────────────────────────────────────────

export const Color: Story = {
  name: 'Color',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.color })
            color = '#4f46e5';
          }
          return TestModel;
        })(),
        options: {
          key: 'color',
          item: signal({ color: '#4f46e5' }),
          options: { type: FieldType.color },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 7. Address ─────────────────────────────────────────────────────────────

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
          options: {
            key: 'address',
            item: signal({ address: addressValue }),
            options: { type: FieldType.address },
          },
        },
      },
      template: `
        <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
      `,
    };
  },
};

// ─── 8. PhoneNumberPl ───────────────────────────────────────────────────────

export const PhoneNumberPl: Story = {
  name: 'Phone Number PL',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.phoneNumberPl })
            phone = '600700800';
          }
          return TestModel;
        })(),
        options: {
          key: 'phone',
          item: signal({ phone: '600700800' }),
          options: { type: FieldType.phoneNumberPl },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 9. DateRange ───────────────────────────────────────────────────────────

export const DateRange: Story = {
  name: 'Date Range',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.dateRange })
            range = { start: '2026-01-01', end: '2026-01-31' };
          }
          return TestModel;
        })(),
        options: {
          key: 'range',
          item: signal({ range: { start: '2026-01-01', end: '2026-01-31' } }),
          options: { type: FieldType.dateRange },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 10. Image ──────────────────────────────────────────────────────────────

export const Image: Story = {
  name: 'Image',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.image })
            photo: any = { id: 'abc' };
          }
          return TestModel;
        })(),
        options: {
          key: 'photo',
          item: signal({ photo: { id: 'abc' } }),
          options: { type: FieldType.image },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 11. Logo ───────────────────────────────────────────────────────────────

export const Logo: Story = {
  name: 'Logo',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.logo })
            logo = 'https://via.placeholder.com/150';
          }
          return TestModel;
        })(),
        options: {
          key: 'logo',
          item: signal({ logo: 'https://via.placeholder.com/150' }),
          options: { type: FieldType.logo },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 12. Video ──────────────────────────────────────────────────────────────

export const Video: Story = {
  name: 'Video',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.video })
            video: any = { id: 'sample' };
          }
          return TestModel;
        })(),
        options: {
          key: 'video',
          item: signal({ video: { id: 'sample' } }),
          options: { type: FieldType.video },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 13. Attachment ─────────────────────────────────────────────────────────

export const Attachment: Story = {
  name: 'Attachment',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.attachment })
            file: any = { id: 'doc' };
          }
          return TestModel;
        })(),
        options: {
          key: 'file',
          item: signal({ file: { id: 'doc' } }),
          options: { type: FieldType.attachment },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 14. Pdf ────────────────────────────────────────────────────────────────

export const Pdf: Story = {
  name: 'PDF',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.pdf })
            file: any = { id: 'brochure' };
          }
          return TestModel;
        })(),
        options: {
          key: 'file',
          item: signal({ file: { id: 'brochure' } }),
          options: { type: FieldType.pdf },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 15. Object ─────────────────────────────────────────────────────────────

@Model({})
class NestedUserModel {
  @Field({ details: true })
  firstName = 'Jan';

  @Field({ details: true })
  lastName = 'Kowalski';
}

export const ObjectField: Story = {
  name: 'Object',
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
        options: {
          key: 'user',
          item: signal({
            title: 'Employee',
            user: { firstName: 'Jan', lastName: 'Kowalski' },
          }),
          options: { type: FieldType.object },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 16. Array ──────────────────────────────────────────────────────────────

@Model({})
class ArrayItemModel {
  @Field({ details: true })
  name = '';
}

export const ArrayField: Story = {
  name: 'Array',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.array })
            items: ArrayItemModel[] = [
              Object.assign(new ArrayItemModel(), { name: 'Item A' }),
              Object.assign(new ArrayItemModel(), { name: 'Item B' }),
            ];
          }
          return TestModel;
        })(),
        options: {
          key: 'items',
          item: signal({
            items: [{ name: 'Item A' }, { name: 'Item B' }],
          }),
          options: {
            type: FieldType.array,
            arrayType: ArrayItemModel,
          },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 17. Playground ─────────────────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.text })
            label = 'Playground value';

            @Field({ details: true, type: FieldType.email })
            email = 'playground@example.com';

            @Field({ details: true, type: FieldType.flag })
            active = true;

            @Field({ details: true, type: FieldType.color })
            color = '#10b981';
          }
          return TestModel;
        })(),
        rows: [
          {
            key: 'label',
            item: signal({ label: 'Playground value' }),
            options: { type: FieldType.text },
          },
          {
            key: 'email',
            item: signal({ email: 'playground@example.com' }),
            options: { type: FieldType.email },
          },
          {
            key: 'active',
            item: signal({ active: true }),
            options: { type: FieldType.flag },
          },
          {
            key: 'color',
            item: signal({ color: '#10b981' }),
            options: { type: FieldType.color },
          },
        ],
      },
    },
    template: `
      <div class="smart:grid smart:grid-cols-2 smart:gap-6 smart:p-4">
        @for (row of storyOptions.rows; track row.key) {
          <div>
            <smart-detail [options]="row" [type]="storyOptions.type"></smart-detail>
          </div>
        }
      </div>
    `,
  }),
};

// ─── 18. Loading / Skeleton ─────────────────────────────────────────────────

export const Loading: Story = {
  name: 'Loading (Skeleton)',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.text })
            label = '';
          }
          return TestModel;
        })(),
        options: {
          key: 'label',
          // item is intentionally absent to trigger skeleton state
          options: { type: FieldType.text },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 19. WithInfo ───────────────────────────────────────────────────────────

export const WithInfo: Story = {
  name: 'With Info Tooltip',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.text })
            description = 'Some field value';
          }
          return TestModel;
        })(),
        options: {
          key: 'description',
          item: signal({ description: 'Some field value' }),
          options: {
            type: FieldType.text,
            info: 'Helpful tooltip text explaining this field',
          },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
  }),
};

// ─── 20. WithCssClass ───────────────────────────────────────────────────────

export const WithCssClass: Story = {
  name: 'With CSS Class',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.text })
            note = 'Highlighted field';
          }
          return TestModel;
        })(),
        options: {
          key: 'note',
          item: signal({ note: 'Highlighted field' }),
          options: { type: FieldType.text },
        },
      },
    },
    template: `
      <div class="smart:bg-yellow-50 smart:p-4 smart:rounded-lg smart:border smart:border-yellow-200">
        <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
      </div>
    `,
  }),
};

// ─── 21. CustomViaToken ─────────────────────────────────────────────────────

@Component({
  selector: 'custom-detail-text',
  template: `<p
    class="smart:rounded smart:bg-indigo-100 smart:px-2 smart:py-1 dark:smart:bg-indigo-900"
  >
    CUSTOM: {{ options()?.item?.()?.['label'] }}
  </p>`,
  standalone: true,
})
class CustomDetailTextComponent extends DetailBaseComponent<any> {}

export const CustomViaToken: Story = {
  name: 'Custom via Token',
  render: () => ({
    props: {
      storyOptions: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({ details: true, type: FieldType.text })
            label = 'Replaced by custom component';
          }
          return TestModel;
        })(),
        options: {
          key: 'label',
          item: signal({ label: 'Replaced by custom component' }),
          options: { type: FieldType.text },
        },
      },
    },
    template: `
      <smart-detail [options]="storyOptions.options" [type]="storyOptions.type"></smart-detail>
    `,
    moduleMetadata: {
      providers: [
        {
          provide: DETAIL_FIELD_COMPONENTS_TOKEN,
          useValue: { [FieldType.text]: CustomDetailTextComponent },
        },
      ],
    },
  }),
};
