import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { MatSortModule } from "@angular/material/sort";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {LazyLoadImageModule} from "ng-lazyload-image";
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {CdkTableModule} from '@angular/cdk/table';
import { DynamicComponent, DynamicModule } from 'ng-dynamic-component';
import { MatButtonModule } from '@angular/material/button';

import { ButtonComponent } from '@smartsoft001/angular';
import { DetailComponent } from '@smartsoft001/angular';
import { DetailEmailComponent } from '@smartsoft001/angular';
import { DetailEnumComponent } from '@smartsoft001/angular';
import { DetailFlagComponent } from '@smartsoft001/angular';
import { DetailTextComponent } from '@smartsoft001/angular';
import { DetailsComponent } from '@smartsoft001/angular';
import { DetailsStandardComponent } from '@smartsoft001/angular';
import { FormStandardComponent } from '@smartsoft001/angular';
import { ListDesktopComponent } from '@smartsoft001/angular';
import { ListMobileComponent } from '@smartsoft001/angular';
import { LoaderComponent } from '@smartsoft001/angular';
import { PageStandardComponent } from '@smartsoft001/angular';
import { SharedDirectivesModule } from '@smartsoft001/angular';
import { DetailAddressComponent } from '@smartsoft001/angular';
import { DetailObjectComponent } from '@smartsoft001/angular';
import { DetailColorComponent } from '@smartsoft001/angular';
import { DetailLogoComponent } from '@smartsoft001/angular';
import { ExportComponent } from '@smartsoft001/angular';
import { ImportComponent } from '@smartsoft001/angular';
import {DetailArrayComponent} from '@smartsoft001/angular'
import {DetailPdfComponent} from '@smartsoft001/angular'
import {DetailVideoComponent} from '@smartsoft001/angular'
import {DetailAttachmentComponent} from '@smartsoft001/angular'
import {DetailDateRangeComponent} from '@smartsoft001/angular'
import {DetailImageComponent} from '@smartsoft001/angular'
import {ListMasonryGridComponent} from '@smartsoft001/angular'
import {FormStepperComponent} from '@smartsoft001/angular'
import {ButtonStandardComponent} from '@smartsoft001/angular'
import {DetailPhoneNumberPlComponent} from '@smartsoft001/angular'

import { CardComponent } from "./card/card.component";
import { FormComponent } from "./form/form.component";
import { ListComponent } from "./list/list.component";
import { PageComponent } from "./page/page.component";
import { SharedPipesModule } from "../pipes/pipes.module";
import { InfoComponent, InfoModalComponent } from "./info/info.component";
import {DETAILS_COMPONENT_TOKEN, FORM_COMPONENT_TOKEN} from "../shared.inectors";

export const BUTTON_COMPONENTS = [ButtonComponent, ButtonStandardComponent];

export const CARD_COMPONENTS = [CardComponent];

export const DETAILS_COMPONENTS = [DetailsComponent, DetailsStandardComponent];

export const DETAIL_COMPONENTS = [
  DetailComponent,
  DetailTextComponent,
  DetailFlagComponent,
  DetailEnumComponent,
  DetailEmailComponent,
  DetailAddressComponent,
  DetailObjectComponent,
  DetailColorComponent,
  DetailLogoComponent,
  DetailArrayComponent,
  DetailPdfComponent,
  DetailVideoComponent,
  DetailAttachmentComponent,
  DetailDateRangeComponent,
  DetailImageComponent,
  DetailPhoneNumberPlComponent
];

export const FORM_COMPONENTS = [FormStandardComponent, FormStepperComponent, FormComponent];

export const LIST_COMPONENTS = [
  ListComponent,
  ListMobileComponent,
  ListDesktopComponent,
  ListMasonryGridComponent
];

export const LOADER_COMPONENTS = [LoaderComponent];

export const PAGE_COMPONENTS = [PageStandardComponent, PageComponent];

export const INFO_COMPONENTS = [InfoComponent, InfoModalComponent];


export const DYNAMIC_COMPONENTS = [DynamicComponent];

export const COMPONENTS = [
  ...FORM_COMPONENTS,
  ...PAGE_COMPONENTS,
  ...BUTTON_COMPONENTS,
  ...CARD_COMPONENTS,
  ...LIST_COMPONENTS,
  ...LOADER_COMPONENTS,
  ...DETAIL_COMPONENTS,
  ...DETAILS_COMPONENTS,
  ...DYNAMIC_COMPONENTS,
  ...INFO_COMPONENTS,
  ExportComponent,
  ImportComponent
];

export const IMPORTS = [
  CommonModule,
  IonicModule,
  ReactiveFormsModule,
  FormsModule,
  TranslateModule,
  RouterModule,
  SharedPipesModule,
  SharedDirectivesModule,
  HttpClientModule,
  MatSortModule,
  LazyLoadImageModule,
  DragDropModule,
  MatStepperModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule,
  CdkTableModule,
  DynamicModule
];

@NgModule({
    declarations: [],
    exports: [...COMPONENTS],
    providers: [
      {
        provide: FORM_COMPONENT_TOKEN,
        useValue: FormComponent
      },
      {
        provide: DETAILS_COMPONENT_TOKEN,
        useValue: DetailsComponent
      }
    ],
  imports: [
    ...IMPORTS,
    ...COMPONENTS
  ]
})
export class SharedComponentsModule {}
