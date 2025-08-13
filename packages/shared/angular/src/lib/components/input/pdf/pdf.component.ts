import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    OnInit, Renderer2,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { IonLabel, IonProgressBar, IonText } from '@ionic/angular/standalone';

import {InputFileBaseComponent} from "../base/file.component";
import {FileService} from '../../../services';
import {ToastService} from '../../../services';
import { ButtonComponent } from '../../button';
import { ModelLabelPipe } from '../../../pipes';

@Component({
    selector: 'smart-input-pdf',
    templateUrl: './pdf.component.html',
    styleUrls: ['./pdf.component.scss'],
    imports: [
        IonLabel,
        IonText,
        ButtonComponent,
        ModelLabelPipe,
        TranslatePipe,
        IonProgressBar,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPdfComponent<T> extends InputFileBaseComponent<T> implements OnInit {
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
