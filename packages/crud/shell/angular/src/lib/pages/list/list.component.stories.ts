import { storiesOf } from "@storybook/angular";
import {CommonModule} from "@angular/common";

import {Field, Model} from "@smartsoft001/models";
import {SharedModule} from "@smartsoft001/angular";

import { CrudModule } from "../../crud.module";
import {TranslateModule} from "@ngx-translate/core";
import {StoreModule} from "@ngrx/store";
import {RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {Component} from "@angular/core";

storiesOf("smart-crud-list-page", module)
    .add("export", () => ({
      moduleMetadata: {
        imports: [
            CommonModule,
            IonicModule.forRoot(),
            SharedModule,
            TranslateModule.forRoot(),
            StoreModule.forRoot(
                {},
                {
                    metaReducers: [],
                    runtimeChecks: {
                        strictActionImmutability: false,
                        strictStateImmutability: false
                    }
                }
            ),
            RouterModule.forRoot([], { useHash: true }),
            CrudModule.forFeature({
            routing: true,
            config: {
              type: Note,
              title: "Note",
              entity: "notes",
                export: true,
                pagination: { limit: 25 },
                apiUrl: 'http://207.180.210.142:1201/api/notes'
              //apiUrl: "https://sandbox.smartsoft.biz.pl/api/notes",
            },
          }),
        ],
      },
      template: `
        <div style="height: 400px">
            <smart-crud-list-page></smart-crud-list-page>
        </div>
      `,
    }))
    .add("custom details", () => ({
        moduleMetadata: {
            imports: [
                CommonModule,
                IonicModule.forRoot(),
                SharedModule,
                TranslateModule.forRoot(),
                StoreModule.forRoot(
                    {},
                    {
                        metaReducers: [],
                        runtimeChecks: {
                            strictActionImmutability: false,
                            strictStateImmutability: false
                        }
                    }
                ),
                RouterModule.forRoot([], { useHash: true }),
                CrudModule.forFeature({
                    routing: true,
                    config: {
                        type: Note,
                        title: "Note",
                        entity: "notes",
                        export: true,
                        pagination: { limit: 25 },
                        details: {
                            components: {
                                top: TestDetailsComponent
                            }
                        },
                        apiUrl: 'http://207.180.210.142:1201/api/notes'
                        //apiUrl: "https://sandbox.smartsoft.biz.pl/api/notes",
                    },
                }),
            ],
        },
        template: `
        <div style="height: 400px">
            <smart-crud-list-page></smart-crud-list-page>
        </div>
      `,
    }));

@Component({
    template: `
        <p>Test details</p>
    `
})
export class TestDetailsComponent {}

@Model({})
export class Note {
    @Field({ list: true })
    title: string;

    @Field({ list: true })
    body: string;
}
