import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCol,
  IonIcon,
  IonImg,
  IonLabel,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  imports: [
    IonLabel,
    IonText,
    IonRow,
    IonCol,
    IonCard,
    IonImg,
    IonButton,
    IonIcon,
    ModelLabelPipe,
    AsyncPipe,
  ],
})
export class InputLogoComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  set(inputFile: HTMLInputElement) {
    inputFile.click();

    inputFile.onchange = () => {
      if (!inputFile.files?.[0]) {
        inputFile.onchange = null;
        inputFile.files = null;
        return;
      }

      const reader = new FileReader();

      reader.onload = ((theFile) => {
        return (e) => {
          const binaryData = e.target?.result;
          const base64String = window.btoa(binaryData as any);

          this.control.markAsDirty();
          this.control.markAsTouched();
          this.control.setValue('data:image/jpeg;base64, ' + base64String);

          this.cd.detectChanges();
        };
      })(inputFile);

      reader.readAsBinaryString(inputFile.files[0]);
      inputFile.onchange = null;
      inputFile.files = null;
    };
  }

  clear() {
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.control.setValue(null);
  }
}
