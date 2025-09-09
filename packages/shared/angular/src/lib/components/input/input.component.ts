import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  effect,
  ElementRef,
  inject,
  Injector,
  input, model,
  OnInit,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import * as _ from 'lodash';

import {
  FieldType,
  getModelFieldOptions,
  getModelFieldsWithOptions,
  IFieldOptions,
} from '@smartsoft001/models';

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
  styles: [
    `
      .container-right {
        top: 15%;
        z-index: 666;
      }
    `,
  ],
  imports: [
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
  private componentFactoryResolver = inject(ComponentFactoryResolver);
  private injector = inject(Injector);

  status!: any;
  fieldOptions: IFieldOptions | undefined;
  FieldType = FieldType;

  componentRef = viewChild<ViewContainerRef | undefined>('componentRef');

  options = input<InputOptions<T>>();

  constructor() {
    effect(() => {
      const options = this.options();
      let key = options?.fieldKey;

      if (options && key) {
        if (key.endsWith('Confirm')) {
          key = key.replace('Confirm', '');
        }

        let fieldOptions: IFieldOptions | undefined = getModelFieldOptions(
          options?.model,
          key,
        );
        if (!fieldOptions && (options.model as any)[0])
          fieldOptions = getModelFieldOptions((options.model as any)[0], key);
        if (!fieldOptions) {
          fieldOptions = getModelFieldsWithOptions(options.model).find(
            (x) => x.key === key,
          )?.options;
        }

        if (fieldOptions) {
          if (options.mode === 'create' && _.isObject(fieldOptions.create)) {
            fieldOptions = {
              ...fieldOptions,
              ...(fieldOptions.create as IFieldOptions),
            };
          } else if (
            options.mode === 'update' &&
            _.isObject(fieldOptions.update)
          ) {
            fieldOptions = {
              ...fieldOptions,
              ...(fieldOptions.update as IFieldOptions),
            };
          }
        }

        this.fieldOptions = fieldOptions;

        this.initCustomComponent();

        options.control.statusChanges.subscribe((status) => {
          this.status = status;
          (
            this.injector.get(ChangeDetectorRef) as ChangeDetectorRef
          ).detectChanges();
        });
      }
    });
  }

  oSetValue($event: any): void {
    if (!$event) return;

    this.options()?.control.setValue($event);
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
    const component = this.options()?.component;
    if (!component) return;

    await new Promise<void>((res) => res());

    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory<
        InputBaseComponent<any>
      >(component);

    const viewContainerRef = this.componentRef;
    const resolvedViewContainerRef = viewContainerRef();
    resolvedViewContainerRef?.clear();

    if (resolvedViewContainerRef) {
      const componentRef = resolvedViewContainerRef.createComponent(
        componentFactory,
        0,
        this.injector,
      );

      componentRef.instance.options = this.options;
      componentRef.setInput('fieldOptions', this.fieldOptions);
    }
  }
}
