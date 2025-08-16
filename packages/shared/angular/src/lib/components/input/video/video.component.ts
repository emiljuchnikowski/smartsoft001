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
import { delay, tap } from 'rxjs/operators';

import { IButtonOptions } from '../../../models';
import { ModelLabelPipe } from '../../../pipes';
import { FileService } from '../../../services';
import { ToastService } from '../../../services';
import { ButtonComponent } from '../../button';
import { InputFileBaseComponent } from '../base/file.component';

@Component({
  selector: 'smart-input-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  imports: [
    IonLabel,
    ModelLabelPipe,
    AsyncPipe,
    IonText,
    ButtonComponent,
    TranslatePipe,
    IonProgressBar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputVideoComponent<T>
  extends InputFileBaseComponent<T>
  implements OnInit
{
  url!: string | null;
  play!: boolean;
  playButtonOptions: IButtonOptions = {
    click: () => {
      this.play = true;
    },
    loading: this.loading,
  };

  constructor(
    cd: ChangeDetectorRef,
    renderer: Renderer2,
    fileService: FileService,
    toastService: ToastService,
    translateService: TranslateService,
  ) {
    super(cd, renderer, fileService, toastService, translateService);
  }

  protected override afterSetOptionsHandler() {


    this.control.valueChanges
      .pipe(
        tap(() => {
          this.url = null;
          this.play = false;
          this.cd.detectChanges();
        }),
        delay(5000),
        this.takeUntilDestroy,
      )
      .subscribe((value) => {
        if (!value?.id) return;

        this.url = this.fileService.getUrl(value.id);

        this.cd.detectChanges();
      });
  }
}
