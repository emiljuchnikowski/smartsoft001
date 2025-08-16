import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import { IonLabel, IonProgressBar, IonText } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../pipes';
import { FileService } from '../../../services';
import { ToastService } from '../../../services';
import { ButtonComponent } from '../../button';
import { InputFileBaseComponent } from '../base/file.component';

@Component({
  selector: 'smart-input-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss'],
  imports: [
    IonLabel,
    ModelLabelPipe,
    AsyncPipe,
    TranslatePipe,
    IonText,
    ButtonComponent,
    IonProgressBar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAttachmentComponent<T>
  extends InputFileBaseComponent<T>
  implements OnInit
{
  constructor(
    cd: ChangeDetectorRef,
    renderer: Renderer2,
    fileService: FileService,
    toastService: ToastService,
    translateService: TranslateService,
  ) {
    super(cd, renderer, fileService, toastService, translateService);
  }
}
