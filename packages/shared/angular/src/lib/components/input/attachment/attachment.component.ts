import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    OnInit, Renderer2,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IonLabel, IonProgressBar, IonText } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';

import {InputFileBaseComponent} from "../base/file.component";
import {FileService} from '../../../services';
import {ToastService} from '../../../services';
import { ModelLabelPipe } from '../../../pipes';
import { ButtonComponent } from '../../button';

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
        IonProgressBar
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputAttachmentComponent<T> extends InputFileBaseComponent<T> implements OnInit {
    constructor(
        cd: ChangeDetectorRef,
        renderer: Renderer2,
        fileService: FileService,
        toastService: ToastService,
        translateService: TranslateService
    ) {
        super(cd, renderer, fileService, toastService, translateService);
    }
}
