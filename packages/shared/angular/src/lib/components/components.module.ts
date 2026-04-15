import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicComponent, DynamicModule } from 'ng-dynamic-component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { SharedPipesModule } from '../pipes/pipes.module';
import {
  DETAILS_COMPONENT_TOKEN,
  FORM_COMPONENT_TOKEN,
} from '../shared.inectors';
// TODO: AccordionComponent moved to @smartsoft001-pro/angular (FRA-101)
// import {
//   AccordionComponent,
//   AccordionHeaderComponent,
//   AccordionBodyComponent,
// } from './accordion';
// TODO: ButtonComponent moved to @smartsoft001-pro/angular (FRA-110)
// import { ButtonComponent, ButtonStandardComponent } from './button';
// TODO: CardComponent moved to @smartsoft001-pro/angular (FRA-101)
// import { CardComponent } from './card/card.component';
import { DateEditDefaultComponent } from './date-edit';
import {
  DateRangeDefaultComponent,
  DateRangeModalDefaultComponent,
} from './date-range';
import {
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
} from './detail';
import { DetailsComponent, DetailsStandardComponent } from './details';
import { SharedDirectivesModule } from '../directives';
// TODO: ExportComponent moved to @smartsoft001-pro/angular (FRA-113)
// import { ExportDefaultComponent } from './export';
import { FormComponent, FormStandardComponent } from './form';
// TODO: ImportComponent moved to @smartsoft001-pro/angular (FRA-116)
// import { ImportComponent } from './import';
import { InfoDefaultComponent } from './info';
import {
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
} from './input';
import {
  ListComponent,
  ListMobileComponent,
  ListDesktopComponent,
  ListMasonryGridComponent,
} from './list';
import { LoaderComponent } from './loader';
// TODO: PageComponent moved to @smartsoft001-pro/angular (FRA-121)
// import { PageComponent, PageStandardComponent } from './page';
import { PasswordStrengthComponent } from './password-strength';

// TODO: AccordionComponent moved to @smartsoft001-pro/angular (FRA-101)
export const ACCORDION_COMPONENTS: any[] = [];

// TODO: ButtonComponent moved to @smartsoft001-pro/angular (FRA-110)
export const BUTTON_COMPONENTS: any[] = [];

// TODO: CardComponent moved to @smartsoft001-pro/angular (FRA-101)
export const CARD_COMPONENTS: any[] = [];

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

export const FORM_COMPONENTS = [FormStandardComponent, FormComponent];

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

// TODO: PageComponent moved to @smartsoft001-pro/angular (FRA-121)
export const PAGE_COMPONENTS: any[] = [];

export const INFO_COMPONENTS = [InfoDefaultComponent];
export const DATE_RANGE_COMPONENTS = [
  DateRangeDefaultComponent,
  DateRangeModalDefaultComponent,
];
export const DATE_EDIT_COMPONENTS = [DateEditDefaultComponent];

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
  PasswordStrengthComponent,
];

export const IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  TranslateModule,
  RouterModule,
  SharedPipesModule,
  SharedDirectivesModule,
  HttpClientModule,
  LazyLoadImageModule,
  DragDropModule,
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
