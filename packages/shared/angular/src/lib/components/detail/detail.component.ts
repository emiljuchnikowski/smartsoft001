import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { IonItem, IonLabel, IonSkeletonText } from '@ionic/angular/standalone';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';

import {FieldType} from "@smartsoft001/models";

import {IDetailOptions} from '../../models';
import { DetailEmailComponent } from './email/email.component';
import { DetailFlagComponent } from './flag/flag.component';
import { DetailEnumComponent } from './enum/enum.component';
import { DetailAddressComponent } from './address/address.component';
import { DetailObjectComponent } from './object/object.component';
import { DetailColorComponent } from './color/color.component';
import { DetailLogoComponent } from './logo/logo.component';
import { DetailArrayComponent } from './array/array.component';
import { DetailPdfComponent } from './pdf/pdf.component';
import { DetailVideoComponent } from './video/video.component';
import { DetailAttachmentComponent } from './attachment/attachment.component';
import { DetailDateRangeComponent } from './date-range/date-range.component';
import { DetailImageComponent } from './image/image.component';
import { DetailPhoneNumberPlComponent } from './phone-number-pl/phone-number-pl.component';
import { DetailTextComponent } from './text/text.component';
import { ModelLabelPipe } from '../../pipes';
import { InfoComponent } from '../info';

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
    AsyncPipe,
    ModelLabelPipe,
    InfoComponent,
    IonSkeletonText,
    NgTemplateOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent<T> {
  FieldType = FieldType;

  @Input() options!: IDetailOptions<T>;
  @Input() type: any;
}

