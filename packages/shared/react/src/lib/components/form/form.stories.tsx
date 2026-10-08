import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartForm } from './form';
import { SmartFormPreset } from './preset/form-preset';
import { IFormOptions } from '../../models';
import {
  IModelValidatorsOptions,
  IModelValidatorsProvider,
} from '../../providers/model-validators.provider';
import { INPUT_PRESET_FIELD_COMPONENTS } from '../input/preset-fields';

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

// Each rendered form owns its form group, so every cell needs a fresh options
// object built from a fresh model instance.
const buildOptions = (
  model: FormModelKey,
  mode: 'create' | 'update' = 'create',
): IFormOptions<any> => ({ model: MODELS[model](), mode }) as IFormOptions<any>;

// Keeps the validators the form factory derives from the field options (the
// Angular story provides it because Angular has no library-side default).
const MODEL_VALIDATORS_PROVIDER: IModelValidatorsProvider = {
  get: (options: IModelValidatorsOptions) =>
    Promise.resolve(options.base ?? {}),
};

interface FormArgs {
  model: FormModelKey;
  mode: 'create' | 'update';
  cssClass: string;
}

const meta: Meta<FormArgs> = {
  title: 'Smart-Form/Form',
  tags: ['autodocs'],
  parameters: {
    // The recommended duet: SmartFormPreset restyles the form shell, while
    // INPUT_PRESET_FIELD_COMPONENTS restyle the field internals.
    smart: {
      modelValidatorsProvider: MODEL_VALIDATORS_PROVIDER,
      components: { form: SmartFormPreset },
      inputFieldComponents: INPUT_PRESET_FIELD_COMPONENTS,
    },
  },
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

/** One `<SmartForm>` with its own options, kept for the cell's lifetime. */
const FormCell = ({
  model,
  mode,
  className,
}: {
  model: FormModelKey;
  mode?: 'create' | 'update';
  className?: string;
}) => {
  const options = useMemo(() => buildOptions(model, mode), [model, mode]);

  return <SmartForm options={options} className={className} />;
};

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40, maxWidth: '28rem' }}>
      <FormCell model={args.model} mode={args.mode} className={args.cssClass} />
    </div>
  ),
};
// #endregion

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
    <div style={{ maxWidth: '28rem' }}>{children}</div>
  </section>
);

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}
    >
      <Section title="Simple model">
        <FormCell model="simple" />
      </Section>

      <Section title="Mixed field types (text, email, int, flag)">
        <FormCell model="mixed" />
      </Section>

      <Section title="Nested object field">
        <FormCell model="nested" />
      </Section>

      <Section title="Mode: create">
        <FormCell model="simple" mode="create" />
      </Section>

      <Section title="Mode: update">
        <FormCell model="simple" mode="update" />
      </Section>

      <Section title="External class">
        <FormCell
          model="simple"
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
        />
      </Section>
    </div>
  ),
};
