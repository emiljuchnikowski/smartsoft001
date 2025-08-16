import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';
import { IonItem, IonLabel, IonSkeletonText } from '@ionic/angular/standalone';
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
  styleUrls: ['./detail.component.scss'],
  imports: [
    IonItem,
    IonLabel,
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
    IonSkeletonText,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent<T extends IEntity<string>> {
  FieldType = FieldType;

  readonly options: InputSignal<IDetailOptions<T>> =
    input.required<IDetailOptions<T>>();
  readonly type: InputSignal<any> = input.required<any>();
}
