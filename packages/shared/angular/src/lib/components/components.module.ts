import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  AccordionBodyComponent,
  AccordionComponent,
  AccordionHeaderComponent,
  ButtonComponent,
  DateRangeComponent,
  DateRangeModalComponent,
  InputAddressComponent,
  InputArrayComponent,
  InputAttachmentComponent,
  InputCheckComponent,
  InputColorComponent,
  InputComponent,
  InputCurrencyComponent,
  InputDateComponent,
  InputDateRangeComponent,
  InputDateWithEditComponent,
  InputEmailComponent,
  InputEnumComponent,
  InputErrorComponent,
  InputFileComponent,
  InputFlagComponent,
  InputFloatComponent,
  InputImageComponent,
  InputIntComponent,
  InputIntsComponent,
  InputLogoComponent,
  InputLongTextComponent,
  InputNipComponent,
  InputObjectComponent,
  InputPasswordComponent,
  InputPdfComponent,
  InputPeselComponent,
  InputPhoneNumberComponent,
  InputPhoneNumberPlComponent,
  InputRadioComponent,
  InputStringsComponent,
  InputTextComponent,
  InputVideoComponent,
  PasswordStrengthComponent,
  DetailComponent,
  DetailEmailComponent,
  DetailEnumComponent,
  DetailFlagComponent,
  DetailTextComponent,
  DetailsComponent,
  DetailsStandardComponent,
  FormStandardComponent,
  ListDesktopComponent,
  ListMobileComponent,
  LoaderComponent,
  PageStandardComponent,
  SharedDirectivesModule,
  DetailAddressComponent,
  DetailObjectComponent,
  DetailColorComponent,
  DetailLogoComponent,
  ExportComponent,
  ImportComponent,
  DetailArrayComponent,
  DetailPdfComponent,
  DetailVideoComponent,
  DetailAttachmentComponent,
  DetailDateRangeComponent,
  DetailImageComponent,
  ListMasonryGridComponent,
  FormStepperComponent,
  ButtonStandardComponent,
  DetailPhoneNumberPlComponent,
} from '@smartsoft001/angular';
import { DynamicComponent, DynamicModule } from 'ng-dynamic-component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { CardComponent } from './card/card.component';
import { DateEditComponent } from './date-edit';
import { FormComponent } from './form/form.component';
import { InfoComponent, InfoModalComponent } from './info/info.component';
import { ListComponent } from './list/list.component';
import { PageComponent } from './page/page.component';
import { SharedPipesModule } from '../pipes/pipes.module';
import {
  DETAILS_COMPONENT_TOKEN,
  FORM_COMPONENT_TOKEN,
} from '../shared.inectors';

export const ACCORDION_COMPONENTS = [
  AccordionComponent,
  AccordionHeaderComponent,
  AccordionBodyComponent,
];

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
  DetailPhoneNumberPlComponent,
];

export const FORM_COMPONENTS = [
  FormStandardComponent,
  FormStepperComponent,
  FormComponent,
];

export const INPUT_COMPONENTS = [
  InputComponent,
  InputIntComponent,
  InputErrorComponent,
  InputTextComponent,
  InputPasswordComponent,
  InputFlagComponent,
  InputEnumComponent,
  InputEmailComponent,
  InputCurrencyComponent,
  InputDateComponent,
  InputDateWithEditComponent,
  InputFileComponent,
  InputRadioComponent,
  InputNipComponent,
  InputStringsComponent,
  InputLongTextComponent,
  InputAddressComponent,
  InputObjectComponent,
  InputColorComponent,
  InputLogoComponent,
  InputCheckComponent,
  InputIntsComponent,
  InputPhoneNumberComponent,
  InputPhoneNumberPlComponent,
  InputPeselComponent,
  InputArrayComponent,
  InputPdfComponent,
  InputVideoComponent,
  InputAttachmentComponent,
  InputDateRangeComponent,
  InputImageComponent,
  InputFloatComponent,
];

export const LIST_COMPONENTS = [
  ListComponent,
  ListMobileComponent,
  ListDesktopComponent,
  ListMasonryGridComponent,
];

export const LOADER_COMPONENTS = [LoaderComponent];

export const PAGE_COMPONENTS = [PageStandardComponent, PageComponent];

export const INFO_COMPONENTS = [InfoComponent, InfoModalComponent];
export const DATE_RANGE_COMPONENTS = [
  DateRangeComponent,
  DateRangeModalComponent,
];
export const DATE_EDIT_COMPONENTS = [DateEditComponent];

export const DYNAMIC_COMPONENTS = [DynamicComponent];

export const COMPONENTS = [
  ...FORM_COMPONENTS,
  ...INPUT_COMPONENTS,
  ...PAGE_COMPONENTS,
  ...ACCORDION_COMPONENTS,
  ...DATE_RANGE_COMPONENTS,
  ...DATE_EDIT_COMPONENTS,
  ...BUTTON_COMPONENTS,
  ...CARD_COMPONENTS,
  ...LIST_COMPONENTS,
  ...LOADER_COMPONENTS,
  ...DETAIL_COMPONENTS,
  ...DETAILS_COMPONENTS,
  ...DYNAMIC_COMPONENTS,
  ...INFO_COMPONENTS,
  ExportComponent,
  ImportComponent,
  PasswordStrengthComponent,
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
  DynamicModule,
];

@NgModule({
  declarations: [],
  exports: [...COMPONENTS],
  providers: [
    {
      provide: FORM_COMPONENT_TOKEN,
      useValue: FormComponent,
    },
    {
      provide: DETAILS_COMPONENT_TOKEN,
      useValue: DetailsComponent,
    },
  ],
  imports: [...IMPORTS, ...COMPONENTS],
})
export class SharedComponentsModule {}
