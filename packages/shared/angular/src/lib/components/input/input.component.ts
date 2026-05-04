import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  OnInit,
  Type,
} from '@angular/core';
import * as _ from 'lodash';

import {
  FieldType,
  FieldTypeDef,
  getModelFieldOptions,
  getModelFieldsWithOptions,
  IFieldOptions,
} from '@smartsoft001/models';

import { InputOptions } from '../../models';
import { StyleService } from '../../services';
import { INPUT_FIELD_COMPONENTS_TOKEN } from '../../shared.inectors';
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

const baseMap: Partial<Record<FieldTypeDef, Type<InputBaseComponent<any>>>> = {
  [FieldType.currency]: InputCurrencyComponent,
  [FieldType.date]: InputDateComponent,
  [FieldType.dateWithEdit]: InputDateWithEditComponent,
  [FieldType.email]: InputEmailComponent,
  [FieldType.enum]: InputEnumComponent,
  [FieldType.file]: InputFileComponent,
  [FieldType.flag]: InputFlagComponent,
  [FieldType.int]: InputIntComponent,
  [FieldType.nip]: InputNipComponent,
  [FieldType.password]: InputPasswordComponent,
  [FieldType.radio]: InputRadioComponent,
  [FieldType.text]: InputTextComponent,
  [FieldType.strings]: InputStringsComponent,
  [FieldType.longText]: InputLongTextComponent,
  [FieldType.address]: InputAddressComponent,
  [FieldType.object]: InputObjectComponent,
  [FieldType.color]: InputColorComponent,
  [FieldType.logo]: InputLogoComponent,
  [FieldType.check]: InputCheckComponent,
  [FieldType.ints]: InputIntsComponent,
  [FieldType.phoneNumber]: InputPhoneNumberComponent,
  [FieldType.phoneNumberPl]: InputPhoneNumberPlComponent,
  [FieldType.pesel]: InputPeselComponent,
  [FieldType.array]: InputArrayComponent,
  [FieldType.pdf]: InputPdfComponent,
  [FieldType.video]: InputVideoComponent,
  [FieldType.attachment]: InputAttachmentComponent,
  [FieldType.dateRange]: InputDateRangeComponent,
  [FieldType.image]: InputImageComponent,
  [FieldType.float]: InputFloatComponent,
};

@Component({
  selector: 'smart-input',
  template: `
    @if (!fieldOptions?.hide) {
      <div class="smart:relative">
        @if (fieldOptions?.info) {
          <div class="smart:absolute smart:right-0 smart:top-0">
            <smart-info
              [options]="{ text: fieldOptions?.info ?? '' }"
            ></smart-info>
          </div>
        }
        <smart-loader [show]="status === 'PENDING'"></smart-loader>
        @let resolved = component();
        @if (resolved) {
          <ng-container
            *ngComponentOutlet="resolved; inputs: componentInputs()"
          ></ng-container>
        }
      </div>

      @let errors = options()?.control?.errors;
      @if (errors && options()?.control?.touched) {
        <smart-input-error [errors]="errors"></smart-input-error>
      }
    }
  `,
  imports: [
    NgComponentOutlet,
    InfoComponent,
    LoaderComponent,
    InputErrorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent<T> implements OnInit {
  private extendMap = inject(INPUT_FIELD_COMPONENTS_TOKEN, { optional: true });
  private injector = inject(Injector);

  status: any;
  fieldOptions: IFieldOptions | undefined;

  options = input<InputOptions<T>>();

  component = computed(() => {
    const explicit = this.options()?.component as
      | Type<InputBaseComponent<any>>
      | undefined;
    if (explicit) return explicit;
    const type = this.fieldOptions?.type;
    if (!type) return null;
    const map = { ...baseMap, ...(this.extendMap ?? {}) };
    return map[type] ?? null;
  });

  componentInputs = computed(() => ({
    options: this.options(),
    fieldOptions: this.fieldOptions,
  }));

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

        options.control.statusChanges.subscribe((status) => {
          this.status = status;
          (
            this.injector.get(ChangeDetectorRef) as ChangeDetectorRef
          ).detectChanges();
        });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const styleService = this.injector.get(StyleService);
    const elementRef = this.injector.get(ElementRef);
    styleService.init(elementRef);
  }
}
