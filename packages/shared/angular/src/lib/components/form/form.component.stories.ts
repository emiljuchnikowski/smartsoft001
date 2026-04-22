import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SharedFactoriesModule } from '../../factories';
import { IFormOptions } from '../../models';
import { FORM_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { COMPONENTS, IMPORTS } from '../components.module';
import { FormBaseComponent } from './base/base.component';
import { FormComponent } from './form.component';

const meta: Meta<FormComponent<any>> = {
  title: 'Smart-Form/Form',
  component: FormComponent,
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
            @Field({}) firstName = '';
            @Field({ required: true }) lastName = '';
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
  @Field({})
  firstName = '';

  @Field({ required: true })
  lastName = '';

  @Field({ type: FieldType.email })
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
            @Field({}) title = '';

            @Field({ type: FieldType.object, classType: UserModel })
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
            @Field({}) firstName = '';
            @Field({ required: true }) lastName = '';
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
    template: `
      <smart-form
        class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 dark:smart:bg-yellow-900/30"
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
      class="smart:rounded-md smart:border smart:border-indigo-300 smart:bg-indigo-50 smart:p-4 dark:smart:border-indigo-700 dark:smart:bg-indigo-900/40"
    >
      <p
        class="smart:font-semibold smart:text-indigo-900 dark:smart:text-indigo-100"
      >
        Custom form implementation injected via FORM_STANDARD_COMPONENT_TOKEN
      </p>
      @for (field of fields; track field) {
        <p
          class="smart:mt-2 smart:text-sm smart:text-indigo-700 dark:smart:text-indigo-300"
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
            @Field({}) firstName = '';
            @Field({ required: true }) lastName = '';
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
