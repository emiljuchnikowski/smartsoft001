import {storiesOf} from "@storybook/angular";
import {TranslateModule} from "@ngx-translate/core";
import {of} from "rxjs";

import {FieldType, Field, Model} from "@smartsoft001/models";
import {IAddress} from "@smartsoft001/domain-core";

import {SharedFactoriesModule} from "../../factories";
import {COMPONENTS, IMPORTS} from "../components.module";
import {IDetailsOptions} from "../../models";
import {DetailsComponent} from "./details.component";

const moduleMetadata = {
    imports: [...IMPORTS, SharedFactoriesModule, TranslateModule.forRoot()],
    declarations: COMPONENTS
};

storiesOf('smart-details', module)
    .add('address', () => ({
        moduleMetadata: moduleMetadata,
        component: DetailsComponent,
        props: {
            options: (() => {
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

                return {
                    type: TestModel,
                    item$: of(new TestModel())
                }
            })() as IDetailsOptions<any>
        }
    }))
    .add('string', () => ({
        moduleMetadata: moduleMetadata,
        component: DetailsComponent,
        props: {
            options: (() => {
                @Model({})
                class TestModel {
                    @Field({
                        details: true,
                        type: FieldType.strings
                    })
                    strings = [ "test1", "test2" ];
                }

                return {
                    type: TestModel,
                    item$: of(new TestModel())
                }
            })() as IDetailsOptions<any>
        }
    }))
    .add('object', () => ({
        moduleMetadata: moduleMetadata,
        component: DetailsComponent,
        props: {
            options: (() => {
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

                return {
                    type: TestModel,
                    item$: of(new TestModel())
                }
            })() as IDetailsOptions<any>
        }
    }))
    .add('color', () => ({
        moduleMetadata: moduleMetadata,
        component: DetailsComponent,
        props: {
            options: (() => {
                @Model({})
                class TestModel {
                    @Field({
                        details: true,
                        type: FieldType.color
                    })
                    color = 'red';
                }

                return {
                    type: TestModel,
                    item$: of(new TestModel())
                }
            })() as IDetailsOptions<any>
        }
    }))
    .add('logo', () => ({
        moduleMetadata: moduleMetadata,
        component: DetailsComponent,
        props: {
            options: (() => {
                @Model({})
                class TestModel {
                    @Field({
                        details: true,
                        type: FieldType.logo
                    })
                    logo = 'https://picsum.photos/200/300';
                }

                return {
                    type: TestModel,
                    item$: of(new TestModel())
                }
            })() as IDetailsOptions<any>
        }
    }))
