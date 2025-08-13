import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TranslateModule } from "@ngx-translate/core";

import { FieldType, Field, Model } from "@smartsoft001/models";
import { IAddress } from "@smartsoft001/domain-core";

import { SharedFactoriesModule } from "../../factories";
import { COMPONENTS, IMPORTS } from "../components.module";
import { DetailsComponent } from "./details.component";

@Model({})
class TestUserModel {
    @Field({
        details: true
    })
    firstName = 'Test first name';

    @Field({
        details: true
    })
    lastName = 'Test last name';
}

const meta: Meta<DetailsComponent<any>> = {
  title: 'Smart-Details/Details',
  component: DetailsComponent,
  decorators: [
    moduleMetadata({
      imports: [...IMPORTS, SharedFactoriesModule, TranslateModule.forRoot()],
      declarations: COMPONENTS
    })
  ]
};

export default meta;
type Story = StoryObj<DetailsComponent<any>>;

export const Address: Story = {
  name: 'Adres',
  render: () => ({
    props: {
      options: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({
              details: true,
              type: FieldType.address
            })
            address: IAddress = {
              city: 'Test city',
              street: 'Test street',
              zipCode: '00-000',
              flatNumber: '2',
              buildingNumber: '1A'
            };
          }
          return TestModel;
        })(),
        item: new ((() => {
          @Model({})
          class TestModel {
            @Field({
              details: true,
              type: FieldType.address
            })
            address: IAddress = {
              city: 'Test city',
              street: 'Test street',
              zipCode: '00-000',
              flatNumber: '2',
              buildingNumber: '1A'
            };
          }
          return TestModel;
        })())()
      }
    }
  })
};

export const StringArray: Story = {
  name: 'Tablica stringów',
  render: () => ({
    props: {
      options: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({
              details: true,
              type: FieldType.strings
            })
            strings = ["test1", "test2"];
          }
          return TestModel;
        })(),
        item: new ((() => {
          @Model({})
          class TestModel {
            @Field({
              details: true,
              type: FieldType.strings
            })
            strings = ["test1", "test2"];
          }
          return TestModel;
        })())()
      }
    }
  })
};

export const ObjectField: Story = {
  name: 'Obiekt',
  render: () => ({
    props: {
      options: {
        type: (() => {
          @Model({})
          class TestModel {
            @Field({
              details: true
            })
            test = 'Test data';

            @Field({
              details: true,
              type: FieldType.object,
            })
            user = new TestUserModel();
          }
          return TestModel;
        })(),
        item: new ((() => {
          @Model({})
          class TestModel {
            @Field({
              details: true
            })
            test = 'Test data';

            @Field({
              details: true,
              type: FieldType.object,
            })
            user = new TestUserModel();
          }
          return TestModel;
        })())()
      }
    }
  })
};
