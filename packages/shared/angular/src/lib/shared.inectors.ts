import { InjectionToken, Type } from '@angular/core';

import { FieldTypeDef } from '@smartsoft001/models';

import {
  ButtonBaseComponent,
  CardBaseComponent,
  DetailBaseComponent,
  DetailsBaseComponent,
  FormBaseComponent,
  InfoBaseComponent,
  LoaderBaseComponent,
  InputBaseComponent,
  ListBaseComponent,
  PageBaseComponent,
  PagingBaseComponent,
  PasswordStrengthBaseComponent,
} from './components';
import { ListMode, SmartPageVariant } from './models';

export const FORM_COMPONENT_TOKEN = new InjectionToken<any>('FORM_COMPONENT');
export const DETAILS_COMPONENT_TOKEN = new InjectionToken<any>(
  'DETAILS_COMPONENT_TOKEN',
);
export const BUTTON_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<ButtonBaseComponent>
>('BUTTON_STANDARD_COMPONENT');
export const CARD_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<CardBaseComponent>
>('CARD_STANDARD_COMPONENT');
export const DETAILS_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<DetailsBaseComponent<any>>
>('DETAILS_STANDARD_COMPONENT');
export const DETAIL_FIELD_COMPONENTS_TOKEN = new InjectionToken<
  Partial<Record<FieldTypeDef, Type<DetailBaseComponent<any>>>>
>('DETAIL_FIELD_COMPONENTS_TOKEN');
export const FORM_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<FormBaseComponent<any>>
>('FORM_STANDARD_COMPONENT');
export const INFO_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<InfoBaseComponent>
>('INFO_STANDARD_COMPONENT');
export const INPUT_FIELD_COMPONENTS_TOKEN = new InjectionToken<
  Partial<Record<FieldTypeDef, Type<InputBaseComponent<any>>>>
>('INPUT_FIELD_COMPONENTS_TOKEN');
export const LIST_MODE_COMPONENTS_TOKEN = new InjectionToken<
  Partial<Record<ListMode, Type<ListBaseComponent<any>>>>
>('LIST_MODE_COMPONENTS');
export const LOADER_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<LoaderBaseComponent>
>('LOADER_STANDARD_COMPONENT');
export const PAGE_VARIANT_COMPONENTS_TOKEN = new InjectionToken<
  Partial<Record<SmartPageVariant, Type<PageBaseComponent>>>
>('PAGE_VARIANT_COMPONENTS');
export const PAGING_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<PagingBaseComponent>
>('PAGING_STANDARD_COMPONENT');
export const PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<PasswordStrengthBaseComponent>
>('PASSWORD_STRENGTH_STANDARD_COMPONENT');
