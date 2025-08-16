import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import {
  FieldType,
  getModelFieldOptions,
  getModelOptions,
  IFieldOptions,
  IModelOptions,
} from '@smartsoft001/models';
import { ObjectService } from '@smartsoft001/utils';
import { DynamicIoDirective } from 'ng-dynamic-component';

import { FormFactory } from '../../../factories';
import { IButtonOptions, IFormOptions } from '../../../models';
import { ModelLabelPipe } from '../../../pipes';
import { FORM_COMPONENT_TOKEN } from '../../../shared.inectors';
import {
  AccordionBodyComponent,
  AccordionComponent,
  AccordionHeaderComponent,
} from '../../accordion';
import { ButtonComponent } from '../../button';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss'],
  imports: [
    IonLabel,
    IonText,
    ModelLabelPipe,
    AsyncPipe,
    IonList,
    CdkDropList,
    ButtonComponent,
    TranslatePipe,
    IonCard,
    IonCardContent,
    NgComponentOutlet,
    DynamicIoDirective,
    IonItem,
    AccordionComponent,
    AccordionHeaderComponent,
    IonCardHeader,
    IonButton,
    IonIcon,
    AccordionBodyComponent,
    CdkDrag,
  ],
})
export class InputArrayComponent<T, TChild> extends InputBaseComponent<T> {
  childOptions!: Array<
    IFormOptions<TChild> & {
      fieldOptions: IFieldOptions;
      show?: boolean;
      modelOptions: IModelOptions;
    }
  >;
  addButtonOptions: IButtonOptions = {
    click: async () => {
      const options = this.getOptions();
      const modelOptions = getModelOptions(options.classType);
      const control = await this.factory.create(
        new this.fieldOptions!.classType(),
        {
          mode: this.internalOptions.mode,
          root: this.internalOptions.control.root,
        },
      );
      (this.internalOptions.control as UntypedFormArray).push(control);
      this.childOptions.push({
        treeLevel: this.internalOptions.treeLevel + 1,
        mode: this.internalOptions.mode,
        control,
        model: ObjectService.createByType(control.value, options.classType),
        fieldOptions: options,
        modelOptions,
        show: true,
      });
      this.control.markAsDirty();

      setTimeout(() => {
        this.cd.detectChanges();
      });
    },
  };

  FieldType = FieldType;

  constructor(
    cd: ChangeDetectorRef,
    private factory: FormFactory,
    @Inject(FORM_COMPONENT_TOKEN) public formComponent: any,
  ) {
    super(cd);
  }

  protected override afterSetOptionsHandler() {
    this.initData();
  }

  onRemove(index: number) {
    (this.internalOptions.control as UntypedFormArray).removeAt(index);
    this.initData();
    this.control.markAsDirty();
    this.control.setValue(this.childOptions.map((o) => o.control?.value));
  }

  private initData(): void {
    this.childOptions = (
      this.internalOptions.control as UntypedFormArray
    ).controls.map((control) => {
      const options = this.getOptions();
      const modelOptions = getModelOptions(options.classType);

      return {
        treeLevel: this.internalOptions.treeLevel + 1,
        mode: this.internalOptions.mode,
        control,
        model: ObjectService.createByType(control.value, options.classType),
        fieldOptions: options,
        modelOptions,
        show: false,
      } as IFormOptions<TChild> & {
        fieldOptions: IFieldOptions;
        modelOptions: IModelOptions;
      };
    });

    this.internalOptions.control.valueChanges
      .pipe(this.takeUntilDestroy)
      .subscribe(() => {
        this.control.markAsDirty();
      });
  }

  drop(event: CdkDragDrop<T, any>) {
    this.control.markAsDirty();

    const swapArray = function (arr: any[], index1: number, index2: number) {
      const temp = arr[index1];

      arr[index1] = arr[index2];
      arr[index2] = temp;
    };
    swapArray(this.childOptions, event.previousIndex, event.currentIndex);

    const swapFormArray = function (
      arr: UntypedFormArray,
      index1: any,
      index2: any,
    ) {
      const c1 = arr.at(index1);
      const c2 = arr.at(index2);

      arr.controls[index2] = c1;
      arr.controls[index1] = c2;
    };
    swapFormArray(
      this.control as UntypedFormArray,
      event.previousIndex,
      event.currentIndex,
    );

    this.control.updateValueAndValidity();
  }

  private getOptions(): IFieldOptions {
    return (this.internalOptions.model as any)[0] &&
      (this.internalOptions.model as any)[0][this.internalOptions.fieldKey]
      ? getModelFieldOptions(
          (this.internalOptions.model as any)[0],
          this.internalOptions.fieldKey,
        )
      : getModelFieldOptions(
          this.internalOptions.model,
          this.internalOptions.fieldKey,
        );
  }
}
