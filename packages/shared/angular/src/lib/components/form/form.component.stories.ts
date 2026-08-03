import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SharedFactoriesModule } from '../../factories';
import { IFormOptions } from '../../models';
import {
  IModelValidatorsOptions,
  MODEL_VALIDATORS_PROVIDER,
} from '../../providers';
import {
  FORM_COMPONENT_TOKEN,
  FORM_STANDARD_COMPONENT_TOKEN,
} from '../../shared.inectors';
import { COMPONENTS, IMPORTS } from '../components.module';
import {
  INPUT_FIELD_COMPONENTS_TOKEN,
  INPUT_PRESET_FIELD_COMPONENTS,
} from '../input';
import { FormBaseComponent } from './base/base.component';
import { FormComponent } from './form.component';
import { FormPresetComponent } from './preset/preset.component';

const meta: Meta<FormComponent<any>> = {
  title: 'Smart-Form/Form',
  component: FormComponent,
  decorators: [
    // FormFactory injects MODEL_VALIDATORS_PROVIDER with no library-side
    // default (apps provide it). The provider must be root-level
    // (applicationConfig) — moduleMetadata providers don't reach the
    // standalone story wrapper's environment injector.
    applicationConfig({
      providers: [
        {
          provide: MODEL_VALIDATORS_PROVIDER,
          useValue: {
            get: (options: IModelValidatorsOptions) =>
              Promise.resolve(options.base ?? {}),
          },
        },
        // Nested object fields render their sub-form through this token; in
        // apps ComponentsModule provides it, but the stories import bare
        // COMPONENTS so the module providers never load.
        { provide: FORM_COMPONENT_TOKEN, useValue: FormComponent },
      ],
    }),
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
type Story = StoryObj<FormComponent<any>>;

// ─── 1. Simple ───────────────────────────────────────────────────────────────

export const Simple: Story = {
  name: 'Simple',
  render: () => ({
    props: {
      storyOptions: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({ create: true }) firstName = '';
            @Field({ create: true, required: true }) lastName = '';
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
    template: `<smart-form [options]="storyOptions"></smart-form>`,
  }),
};

// ─── 2. ComplexObject ────────────────────────────────────────────────────────

@Model({})
class UserModel {
  @Field({ create: true })
  firstName = '';

  @Field({ create: true, required: true })
  lastName = '';

  @Field({ create: true, type: FieldType.email })
  email = '';
}

export const ComplexObject: Story = {
  name: 'Complex object',
  render: () => ({
    props: {
      storyOptions: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({ create: true }) title = '';

            @Field({
              create: true,
              type: FieldType.object,
              classType: UserModel,
            })
            user = new UserModel();
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
    template: `<smart-form [options]="storyOptions"></smart-form>`,
  }),
};

// ─── 3. WithCssClass ─────────────────────────────────────────────────────────

export const WithCssClass: Story = {
  name: 'With CSS class',
  render: () => ({
    props: {
      storyOptions: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({ create: true }) firstName = '';
            @Field({ create: true, required: true }) lastName = '';
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
    template: `
      <smart-form
        class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
        [options]="storyOptions"
      ></smart-form>
    `,
  }),
};

// ─── 4. CustomViaToken ───────────────────────────────────────────────────────

@Component({
  selector: 'custom-form-impl',
  template: `
    <div
      class="smart:rounded-md smart:border smart:border-indigo-300 smart:bg-indigo-50 smart:p-4 smart:dark:border-indigo-700 smart:dark:bg-indigo-900/40"
    >
      <p
        class="smart:font-semibold smart:text-indigo-900 smart:dark:text-indigo-100"
      >
        Custom form implementation injected via FORM_STANDARD_COMPONENT_TOKEN
      </p>
      @for (field of fields; track field) {
        <p
          class="smart:mt-2 smart:text-sm smart:text-indigo-700 smart:dark:text-indigo-300"
        >
          {{ field }}
        </p>
      }
    </div>
  `,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
class CustomFormImplComponent extends FormBaseComponent<any> {}

export const CustomViaToken: Story = {
  name: 'Custom via FORM_STANDARD_COMPONENT_TOKEN',
  render: () => ({
    props: {
      storyOptions: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({ create: true }) firstName = '';
            @Field({ create: true, required: true }) lastName = '';
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
    template: `<smart-form [options]="storyOptions"></smart-form>`,
    moduleMetadata: {
      providers: [
        {
          provide: FORM_STANDARD_COMPONENT_TOKEN,
          useValue: CustomFormImplComponent,
        },
      ],
    },
  }),
};

// ─── 5. Preset ───────────────────────────────────────────────────────────────

export const Preset: Story = {
  render: () => ({
    props: {
      storyOptions: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({ create: true }) firstName = '';
            @Field({ create: true, required: true }) lastName = '';
            @Field({ create: true, type: FieldType.email }) email = '';
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
    // The recommended duet: FormPresetComponent restyles the form shell, while
    // INPUT_PRESET_FIELD_COMPONENTS restyle the field internals via
    // INPUT_FIELD_COMPONENTS_TOKEN.
    template: `
      <div style="max-width: 28rem; margin: 0 auto; padding: 1.5rem;">
        <smart-form [options]="storyOptions"></smart-form>
      </div>
    `,
    moduleMetadata: {
      providers: [
        {
          provide: FORM_STANDARD_COMPONENT_TOKEN,
          useValue: FormPresetComponent,
        },
        {
          provide: INPUT_FIELD_COMPONENTS_TOKEN,
          useValue: INPUT_PRESET_FIELD_COMPONENTS,
        },
      ],
    },
  }),
};
