import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  InputSignal,
  Type,
} from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';
import { FieldType, FieldTypeDef } from '@smartsoft001/models';

import { IDetailOptions } from '../../models';
import { ModelLabelPipe } from '../../pipes';
import { DETAIL_FIELD_COMPONENTS_TOKEN } from '../../shared.inectors';
import { InfoDefaultComponent } from '../info';
import { DetailAddressComponent } from './address/address.component';
import { DetailArrayComponent } from './array/array.component';
import { DetailAttachmentComponent } from './attachment/attachment.component';
import { DetailBaseComponent } from './base/base.component';
import { DetailColorComponent } from './color/color.component';
import { DetailDateRangeComponent } from './date-range/date-range.component';
import { DetailEmailComponent } from './email/email.component';
import { DetailEnumComponent } from './enum/enum.component';
import { DetailFlagComponent } from './flag/flag.component';
import { DetailImageComponent } from './image/image.component';
import { DetailLogoComponent } from './logo/logo.component';
import { DetailObjectComponent } from './object/object.component';
import { DetailPdfComponent } from './pdf/pdf.component';
import { DetailPhoneNumberPlComponent } from './phone-number-pl/phone-number-pl.component';
import { DetailTextComponent } from './text/text.component';
import { DetailVideoComponent } from './video/video.component';

const baseMap: Partial<Record<FieldTypeDef, Type<DetailBaseComponent<any>>>> = {
  [FieldType.email]: DetailEmailComponent,
  [FieldType.flag]: DetailFlagComponent,
  [FieldType.enum]: DetailEnumComponent,
  [FieldType.address]: DetailAddressComponent,
  [FieldType.object]: DetailObjectComponent,
  [FieldType.color]: DetailColorComponent,
  [FieldType.logo]: DetailLogoComponent,
  [FieldType.array]: DetailArrayComponent,
  [FieldType.pdf]: DetailPdfComponent,
  [FieldType.video]: DetailVideoComponent,
  [FieldType.attachment]: DetailAttachmentComponent,
  [FieldType.dateRange]: DetailDateRangeComponent,
  [FieldType.image]: DetailImageComponent,
  [FieldType.phoneNumberPl]: DetailPhoneNumberPlComponent,
  [FieldType.text]: DetailTextComponent,
};

@Component({
  selector: 'smart-detail',
  templateUrl: './detail.component.html',
  imports: [ModelLabelPipe, InfoDefaultComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent<T extends IEntity<string> | undefined> {
  private extendMap = inject(DETAIL_FIELD_COMPONENTS_TOKEN, { optional: true });

  readonly options: InputSignal<IDetailOptions<T> | undefined> = input.required<
    IDetailOptions<T> | undefined
  >();
  readonly type: InputSignal<any> = input.required<any>();

  component = computed(() => {
    const type = this.options()?.options?.type ?? FieldType.text;
    const map = { ...baseMap, ...(this.extendMap ?? {}) };
    return map[type] ?? DetailTextComponent;
  });

  componentInputs = computed(() => ({
    options: this.options(),
  }));
}
