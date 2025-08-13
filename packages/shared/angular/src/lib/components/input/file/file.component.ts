import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IonLabel, IonText } from '@ionic/angular/standalone';

import {InputBaseComponent} from "../base/base.component";
import { ButtonComponent } from '../../button';
import { ModelLabelPipe } from '../../../pipes';

/**
 * @example
 *
 * set accepts (possibilities property):
 * - @Field({
        create: {
            ...modifyMetdata,
            required: false
        },
        update: {
            ...modifyMetdata,
            required: false,
            multi: true
        },
        type: FieldType.image,
        details: true,
        possibilities: '.jpg',
        list: { order: 1 }
    })
 */
@Component({
  selector: 'smart-input-file',
  templateUrl: './file.component.html',
  imports: [
    IonLabel,
    IonText,
    ButtonComponent,
    ModelLabelPipe,
    AsyncPipe,
    TranslatePipe
  ],
  styleUrls: ['./file.component.scss']
})
export class InputFileComponent<T> extends InputBaseComponent<T> {
  addButtonOptions = {
    click: () => {
      this.control.markAsDirty();
      this.control.markAsTouched();
      (this.inputElementRef.nativeElement as HTMLInputElement).click();
    }
  };

  @ViewChild('inputObj', { read: ElementRef })
  inputElementRef!: ElementRef;

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  changeListener($event: any) : void {
    const file = $event.target.files[0];

    $event.target.type = 'text';
    $event.target.type = 'file';

    this.control.setValue(file);
    this.control.updateValueAndValidity();
    this.cd.detectChanges();
  }
}
