import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';

import { ModelLabelPipe } from '../../../pipes';
import { FileService } from '../../../services';
import { ToastService } from '../../../services';
import { ButtonComponent } from '../../button';
import { InputFileBaseComponent } from '../base/file.component';

@Component({
  selector: 'smart-input-image',
  templateUrl: './image.component.html',
  imports: [ModelLabelPipe, AsyncPipe, ButtonComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputImageComponent<T>
  extends InputFileBaseComponent<T>
  implements OnInit
{
  imageUrl: any;

  constructor(
    cd: ChangeDetectorRef,
    renderer: Renderer2,
    fileService: FileService,
    toastService: ToastService,
    translateService: TranslateService,
  ) {
    super(cd, renderer, fileService, toastService, translateService);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.control.valueChanges
      .pipe(debounceTime(1000), this.takeUntilDestroy)
      .subscribe(() => this.initImage());

    this.initImage();
  }

  private initImage(): void {
    this.imageUrl = this.control.value
      ? this.fileService.getUrl(this.control.value.id)
      : null;
    this.cd.detectChanges();
  }
}
