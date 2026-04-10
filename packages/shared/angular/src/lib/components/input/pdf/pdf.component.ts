import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../pipes';
// TODO: ButtonComponent moved to @smartsoft001-pro/angular (FRA-110)
// import { ButtonComponent } from '../../button';
import { InputFileBaseComponent } from '../base/file.component';

@Component({
  selector: 'smart-input-pdf',
  templateUrl: './pdf.component.html',
  imports: [ModelLabelPipe, TranslatePipe, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPdfComponent<T>
  extends InputFileBaseComponent<T>
  implements OnInit {}
