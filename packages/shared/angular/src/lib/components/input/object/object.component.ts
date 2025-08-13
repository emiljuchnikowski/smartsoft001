import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import { IonLabel, IonText } from '@ionic/angular/standalone';
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { DynamicIoDirective } from 'ng-dynamic-component';

import {InputBaseComponent} from "../base/base.component";
import {IFormOptions} from '../../../models';
import {FORM_COMPONENT_TOKEN} from "../../../shared.inectors";
import { ModelLabelPipe } from '../../../pipes';

@Component({
  selector: 'smart-input-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss'],
  imports: [
    IonLabel,
    IonText,
    ModelLabelPipe,
    AsyncPipe,
    NgComponentOutlet,
    DynamicIoDirective
  ]
})
export class InputObjectComponent<T, TChild> extends InputBaseComponent<T> {
  childOptions!: IFormOptions<TChild>;

  constructor(cd: ChangeDetectorRef, @Inject(FORM_COMPONENT_TOKEN) public formComponent: any) {
    super(cd);
  }

  protected override afterSetOptionsHandler() {
    super.afterSetOptionsHandler();
    this.childOptions = {
      treeLevel: this.internalOptions.treeLevel + 1,
      mode: this.internalOptions.mode,
      control: this.control,
      model: ((this.internalOptions.model as any)[this.internalOptions.fieldKey] as TChild)
    }
  }
}
