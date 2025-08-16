import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { IonItem } from '@ionic/angular/standalone';
import {
  FieldType,
  getModelFieldOptions,
  getModelFieldsWithOptions,
  IFieldOptions,
} from '@smartsoft001/models';
import * as _ from 'lodash';

import { InputOptions } from '../../models';
import { StyleService } from '../../services';
import { InfoComponent } from '../info';
import { LoaderComponent } from '../loader';
import { InputAddressComponent } from './address/address.component';
import { InputArrayComponent } from './array/array.component';
import { InputAttachmentComponent } from './attachment/attachment.component';
import { InputBaseComponent } from './base/base.component';
import { InputCheckComponent } from './check/check.component';
import { InputColorComponent } from './color/color.component';
import { InputCurrencyComponent } from './currency/currency.component';
import { InputDateComponent } from './date/date.component';
import { InputDateRangeComponent } from './date-range/date-range.component';
import { InputDateWithEditComponent } from './date-with-edit/date-with-edit.component';
import { InputEmailComponent } from './email/email.component';
import { InputEnumComponent } from './enum/enum.component';
import { InputErrorComponent } from './error/error.component';
import { InputFileComponent } from './file/file.component';
import { InputFlagComponent } from './flag/flag.component';
import { InputFloatComponent } from './float/float.component';
import { InputImageComponent } from './image/image.component';
import { InputIntComponent } from './int/int.component';
import { InputIntsComponent } from './ints/ints.component';
import { InputLogoComponent } from './logo/logo.component';
import { InputLongTextComponent } from './long-text/long-text.component';
import { InputNipComponent } from './nip/nip.component';
import { InputObjectComponent } from './object/object.component';
import { InputPasswordComponent } from './password/password.component';
import { InputPdfComponent } from './pdf/pdf.component';
import { InputPeselComponent } from './pesel/pesel.component';
import { InputPhoneNumberComponent } from './phone-number/phone-number.component';
import { InputPhoneNumberPlComponent } from './phone-number-pl/phone-number-pl.component';
import { InputRadioComponent } from './radio/radio.component';
import { InputStringsComponent } from './strings/strings.component';
import { InputTextComponent } from './text/text.component';
import { InputVideoComponent } from './video/video.component';

@Component({
  selector: 'smart-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [
    IonItem,
    InfoComponent,
    LoaderComponent,
    InputCurrencyComponent,
    InputDateComponent,
    InputDateWithEditComponent,
    InputEmailComponent,
    InputEnumComponent,
    InputFileComponent,
    InputFlagComponent,
    InputIntComponent,
    InputNipComponent,
    InputPasswordComponent,
    InputRadioComponent,
    InputTextComponent,
    InputStringsComponent,
    InputLongTextComponent,
    InputAddressComponent,
    InputObjectComponent,
    InputColorComponent,
    InputLogoComponent,
    InputCheckComponent,
    InputIntsComponent,
    InputPhoneNumberComponent,
    InputPhoneNumberPlComponent,
    InputPeselComponent,
    InputArrayComponent,
    InputPdfComponent,
    InputVideoComponent,
    InputAttachmentComponent,
    InputDateRangeComponent,
    InputImageComponent,
    InputFloatComponent,
    InputErrorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent<T> implements OnInit {
  private _options!: InputOptions<T>;

  status!: any;
  fieldOptions: IFieldOptions | undefined;
  FieldType = FieldType;

  @ViewChild('componentRef', { read: ViewContainerRef })
  componentRef!: ViewContainerRef;

  @Input() set options(val: InputOptions<T>) {
    this._options = val;
    let key = this._options.fieldKey;

    if (key && key.endsWith('Confirm')) {
      key = key.replace('Confirm', '');
    }

    let fieldOptions: IFieldOptions | undefined = getModelFieldOptions(
      this._options.model,
      key,
    );
    if (!fieldOptions && (this._options.model as any)[0])
      fieldOptions = getModelFieldOptions((this._options.model as any)[0], key);
    if (!fieldOptions) {
      fieldOptions = getModelFieldsWithOptions(this._options.model).find(
        (x) => x.key === key,
      )?.options;
    }

    if (fieldOptions) {
      if (val.mode === 'create' && _.isObject(fieldOptions.create)) {
        fieldOptions = {
          ...fieldOptions,
          ...(fieldOptions.create as IFieldOptions),
        };
      } else if (val.mode === 'update' && _.isObject(fieldOptions.update)) {
        fieldOptions = {
          ...fieldOptions,
          ...(fieldOptions.update as IFieldOptions),
        };
      }
    }

    this.fieldOptions = fieldOptions;

    this.initCustomComponent().then();

    this.options.control.statusChanges.subscribe((status) => {
      this.status = status;
      (
        this.injector.get(ChangeDetectorRef) as ChangeDetectorRef
      ).detectChanges();
    });
  }
  get options(): InputOptions<T> {
    return this._options;
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {}

  oSetValue($event: any): void {
    if (!$event) return;

    if (this.options.control instanceof UntypedFormArray) {
      this.options.control.clear();
    }

    setTimeout(() => {
      this.options.control.setValue($event);
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initStyles();
  }

  private async initStyles() {
    const styleService = this.injector.get(StyleService);
    const elementRef = this.injector.get(ElementRef);

    styleService.init(elementRef);
  }

  private async initCustomComponent(): Promise<void> {
    if (!this.options.component) return;

    await new Promise<void>((res) => res());

    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory<
        InputBaseComponent<any>
      >(this.options.component);

    const viewContainerRef = this.componentRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(
      componentFactory,
      0,
      this.injector,
    );

    componentRef.instance.options = this.options;
    componentRef.instance.fieldOptions = this.fieldOptions;
  }
}
