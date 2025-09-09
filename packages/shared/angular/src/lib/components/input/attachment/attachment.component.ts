import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../pipes';
import { FileService } from '../../../services';
import { ToastService } from '../../../services';
import { ButtonComponent } from '../../button';
import { InputFileBaseComponent } from '../base/file.component';

@Component({
  selector: 'smart-input-attachment',
  templateUrl: './attachment.component.html',
  imports: [ModelLabelPipe, AsyncPipe, TranslatePipe, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAttachmentComponent<T>
  extends InputFileBaseComponent<T>
  implements OnInit
{}
