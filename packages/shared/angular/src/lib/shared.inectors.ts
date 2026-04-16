import { InjectionToken, Type } from '@angular/core';

import { ButtonBaseComponent } from './components/button/base/base.component';

export const FORM_COMPONENT_TOKEN = new InjectionToken<any>('FORM_COMPONENT');
export const DETAILS_COMPONENT_TOKEN = new InjectionToken<any>(
  'DETAILS_COMPONENT_TOKEN',
);
export const BUTTON_STANDARD_COMPONENT_TOKEN = new InjectionToken<
  Type<ButtonBaseComponent>
>('BUTTON_STANDARD_COMPONENT');
