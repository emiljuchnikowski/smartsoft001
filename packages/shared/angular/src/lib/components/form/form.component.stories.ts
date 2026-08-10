import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';
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
import { FormComponent } from './form.component';
import { FormPresetComponent } from './preset/preset.component';

// ─── Fixtures ────────────────────────────────────────────────────────────────

@Model({})
class UserModel {
  @Field({ create: true })
  firstName = '';

  @Field({ create: true, required: true })
  lastName = '';

  @Field({ create: true, type: FieldType.email })
  email = '';
}

@Model({})
class SimpleModel {
  @Field({ create: true })
  firstName = '';

  @Field({ create: true, required: true })
  lastName = '';

  @Field({ create: true, type: FieldType.email })
  email = '';
}

@Model({})
class NestedModel {
  @Field({ create: true })
  title = '';

  @Field({ create: true, type: FieldType.object, classType: UserModel })
  user = new UserModel();
}

@Model({})
class MixedModel {
  @Field({ create: true, required: true })
  name = '';

  @Field({ create: true, type: FieldType.email })
  email = '';

  @Field({ create: true, type: FieldType.int })
  age = 0;

  @Field({ create: true, type: FieldType.flag })
  active = true;
}

type FormModelKey = 'simple' | 'nested' | 'mixed';

const MODELS: Record<FormModelKey, () => object> = {
  simple: () => new SimpleModel(),
  nested: () => new NestedModel(),
  mixed: () => new MixedModel(),
};

// Each rendered form owns its FormGroup, so every cell needs a fresh options
// object built from a fresh model instance.
const buildOptions = (
  model: FormModelKey,
  mode: 'create' | 'update' = 'create',
): IFormOptions<any> => ({ model: MODELS[model](), mode }) as IFormOptions<any>;

interface FormArgs {
  model: FormModelKey;
  mode: 'create' | 'update';
  cssClass: string;
}

const meta: Meta<FormArgs> = {
  title: 'Smart-Form/Form',
  tags: ['autodocs'],
  decorators: [
    // FormFactory injects MODEL_VALIDATORS_PROVIDER with no library-side
    // default (apps provide it). The provider must be root-level
    // (applicationConfig) — moduleMetadata providers don't reach the
    // standalone story wrapper's environment injector.
    applicationConfig({
      providers: [
        ...provideStorybookTranslations(),
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
        TranslateModule,
      ],
      // The recommended duet: FormPresetComponent restyles the form shell,
      // while INPUT_PRESET_FIELD_COMPONENTS restyle the field internals via
      // INPUT_FIELD_COMPONENTS_TOKEN.
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
    }),
  ],
  argTypes: {
    model: {
      control: 'radio',
      options: ['simple', 'nested', 'mixed'],
      description:
        'Which decorated @Model drives the generated fields (simple flat model, nested object field, mixed field types).',
    },
    mode: { control: 'inline-radio', options: ['create', 'update'] },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: { model: 'simple', mode: 'create', cssClass: '' },
};

export default meta;
type Story = StoryObj<FormArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: buildOptions(args.model, args.mode),
      cssClass: args.cssClass,
    },
    template: `
      <div style="padding: 40px; max-width: 28rem;">
        <smart-form [options]="options" [class]="cssClass"></smart-form>
      </div>
    `,
  }),
};

const section = (title: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <div style="max-width: 28rem;">${body}</div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      simple: buildOptions('simple'),
      mixed: buildOptions('mixed'),
      nested: buildOptions('nested'),
      createMode: buildOptions('simple', 'create'),
      updateMode: buildOptions('simple', 'update'),
      styled: buildOptions('simple'),
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'Simple model',
          `<smart-form [options]="simple"></smart-form>`,
        )}

        ${section(
          'Mixed field types (text, email, int, flag)',
          `<smart-form [options]="mixed"></smart-form>`,
        )}

        ${section(
          'Nested object field',
          `<smart-form [options]="nested"></smart-form>`,
        )}

        ${section(
          'Mode: create',
          `<smart-form [options]="createMode"></smart-form>`,
        )}

        ${section(
          'Mode: update',
          `<smart-form [options]="updateMode"></smart-form>`,
        )}

        ${section(
          'External class',
          `<smart-form
             class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
             [options]="styled"
           ></smart-form>`,
        )}

      </div>
    `,
  }),
};
