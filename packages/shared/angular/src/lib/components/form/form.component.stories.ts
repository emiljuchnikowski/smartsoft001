import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { IAddress } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SharedFactoriesModule } from '../../factories';
import { IFormOptions } from '../../models';
import { COMPONENTS, IMPORTS } from '../components.module';
import { FormComponent } from './form.component';

const meta: Meta<FormComponent<any>> = {
  title: 'Smart-Form/Inputs',
  component: FormComponent,
  decorators: [
    moduleMetadata({
      imports: [...IMPORTS, SharedFactoriesModule, TranslateModule.forRoot()],
      declarations: [...COMPONENTS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
};

export default meta;
type Story = StoryObj<FormComponent<any>>;

export const Address: Story = {
  name: 'Adres',
  render: () => ({
    props: {
      options: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({
              required: true,
              type: FieldType.address,
            })
            address!: IAddress;
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
  }),
};

export const Nip: Story = {
  name: 'NIP',
  render: () => ({
    props: {
      options: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({
              required: true,
              type: FieldType.nip,
            })
            nip!: string;
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
  }),
};

export const Strings: Story = {
  name: 'Tablica stringów',
  render: () => ({
    props: {
      options: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({
              required: true,
              type: FieldType.strings,
            })
            strings = ['test1', 'test2'];
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
  }),
};

export const Description: Story = {
  name: 'Opis',
  render: () => ({
    props: {
      options: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({
              required: true,
              type: FieldType.longText,
            })
            desc!: string;
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
  }),
};

export const LongText: Story = {
  name: 'Długi tekst',
  render: () => ({
    props: {
      options: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({
              required: true,
              type: FieldType.longText,
            })
            desc!: string;
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
  }),
};

@Model({})
class TestUserModel {
  @Field({})
  firstName!: string;

  @Field({
    required: true,
  })
  lastName!: string;

  @Field({
    type: FieldType.color,
  })
  color!: string;

  @Field({
    type: FieldType.logo,
  })
  logo!: string;

  @Field({
    required: true,
    type: FieldType.password,
    confirm: true,
  })
  password!: string;
}

export const ComplexObject: Story = {
  name: 'Obiekt złożony',
  render: () => ({
    props: {
      options: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({})
            test!: string;

            @Field({
              required: true,
              type: FieldType.object,
              classType: TestUserModel,
            })
            user = new TestUserModel();
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
  }),
};

export const Color: Story = {
  name: 'Kolor',
  render: () => ({
    props: {
      options: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({
              type: FieldType.color,
              required: true,
            })
            color = 'red';
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
  }),
};

export const Logo: Story = {
  name: 'Logo',
  render: () => ({
    props: {
      options: {
        model: (() => {
          @Model({})
          class TestModel {
            @Field({
              type: FieldType.logo,
              required: true,
            })
            logo!: string;
          }
          return new TestModel();
        })(),
      } as IFormOptions<any>,
    },
  }),
};
