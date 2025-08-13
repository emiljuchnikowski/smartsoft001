import { IonLabel, IonText } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';
import { TranslateService } from "@ngx-translate/core";

import { InputBaseComponent } from "../base/base.component";
import { HardwareService } from '../../../services';
import { ModelLabelPipe } from '../../../pipes';

@Component({
  selector: 'smart-input-long-text',
  templateUrl: './long-text.component.html',
  styleUrls: ['./long-text.component.scss'],
  imports: [
    IonLabel,
    IonText,
    ModelLabelPipe,
    AsyncPipe,
    NgxEditorMenuComponent,
    NgxEditorComponent,
    ReactiveFormsModule
  ]
})
export class InputLongTextComponent<T> extends InputBaseComponent<T>
  implements OnInit, OnDestroy {

  hardwareService = inject(HardwareService);

  editor!: Editor;
  toolbar: Toolbar =
    this.hardwareService.isMobile || this.hardwareService.isMobileWeb
      ? [
          ["bold", "italic"],
          ["text_color", "background_color"],
          ["align_left", "align_center", "align_right", "align_justify"],
        ]
      : [
          // default value
          ["bold", "italic"],
          ["underline", "strike"],
          ["code", "blockquote"],
          ["ordered_list", "bullet_list"],
          [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
          ["link", "image"],
          ["text_color", "background_color"],
          ["align_left", "align_center", "align_right", "align_justify"],
        ];
  placeholder!: string;

  constructor(
    cd: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {
    super(cd);
  }

  ngOnInit() {
    this.placeholder = this.translateService.instant("writeHere") + "...";
    this.editor = new Editor({
      history: true,
      inputRules: true,
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.editor.destroy();
  }
}
