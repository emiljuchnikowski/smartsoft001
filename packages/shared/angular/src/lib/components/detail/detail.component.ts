import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';
import { FieldType } from '@smartsoft001/models';

import { IDetailOptions } from '../../models';
import { ModelLabelPipe } from '../../pipes';
import { InfoComponent } from '../info';
import { DetailAddressComponent } from './address/address.component';
import { DetailArrayComponent } from './array/array.component';
import { DetailAttachmentComponent } from './attachment/attachment.component';
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

@Component({
  selector: 'smart-detail',
  templateUrl: './detail.component.html',
  imports: [
    DetailEmailComponent,
    DetailFlagComponent,
    DetailEnumComponent,
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
    DetailTextComponent,
    ModelLabelPipe,
    InfoComponent,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent<T extends IEntity<string> | undefined> {
  FieldType = FieldType;

  readonly options: InputSignal<IDetailOptions<T> | undefined> = input.required<
    IDetailOptions<T> | undefined
  >();
  readonly type: InputSignal<any> = input.required<any>();
}
