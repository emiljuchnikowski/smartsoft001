import { InjectionToken, Type } from '@angular/core';

import { FieldTypeDef } from '@smartsoft001/models';

import { ButtonBaseComponent } from './components/button/base/base.component';
import { CardBaseComponent } from './components/card/base/base.component';
import { DetailBaseComponent } from './components/detail/base/base.component';
import { DetailsBaseComponent } from './components/details/base/base.component';
import { FormBaseComponent } from './components/form/base/base.component';
import { InputBaseComponent } from './components/input/base/base.component';
import { PageBaseComponent } from './components/page/base/base.component';
import { PagingBaseComponent } from './components/paging/base/base.component';
import { SmartPageVariant } from './models/interfaces';

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
export const INPUT_FIELD_COMPONENTS_TOKEN = new InjectionToken<
  Partial<Record<FieldTypeDef, Type<InputBaseComponent<any>>>>
>('INPUT_FIELD_COMPONENTS_TOKEN');
export const PAGE_VARIANT_COMPONENTS_TOKEN = new InjectionToken<
  Partial<Record<SmartPageVariant, Type<PageBaseComponent>>>
>('PAGE_VARIANT_COMPONENTS');
export const PAGING_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<PagingBaseComponent>
>('PAGING_STANDARD_COMPONENT');
