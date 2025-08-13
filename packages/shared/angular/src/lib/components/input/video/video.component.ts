import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    OnInit, Renderer2,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {delay, tap} from "rxjs/operators";
import { IonLabel, IonProgressBar, IonText } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';

import {InputFileBaseComponent} from "../base/file.component";
import {FileService} from '../../../services';
import {IButtonOptions} from "../../../models";
import {ToastService} from '../../../services';
import { ModelLabelPipe } from '../../../pipes';
import { ButtonComponent } from '../../button';

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
        IonProgressBar
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputVideoComponent<T> extends InputFileBaseComponent<T> implements OnInit {
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
        translateService: TranslateService
    ) {
        super(cd, renderer, fileService, toastService, translateService);
    }

    protected override afterSetOptionsHandler() {
        super.afterSetOptionsHandler();

        this.control.valueChanges.pipe(
            tap(() => {
                this.url = null;
                this.play = false;
                this.cd.detectChanges();
            }),
            delay(5000),
            this.takeUntilDestroy,
        ).subscribe(value => {
            if (!value?.id) return;

            this.url = this.fileService.getUrl(value.id);

            this.cd.detectChanges();
        })
    }
}
