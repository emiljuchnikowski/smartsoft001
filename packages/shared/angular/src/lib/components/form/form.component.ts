import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  Type,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { getModelOptions } from '@smartsoft001/models';
import { ObjectService } from '@smartsoft001/utils';

import { FormFactory } from '../../factories';
import { IFormOptions } from '../../models';
import { MODEL_EXPORT_PROVIDER } from '../../providers';
import { MODEL_IMPORT_PROVIDER } from '../../providers';
import { SmartFormGroup } from '../../services';
import { FORM_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
// TODO: ExportComponent moved to @smartsoft001-pro/angular (FRA-113)
// import { ExportDefaultComponent } from '../export';
// TODO: ImportComponent moved to @smartsoft001-pro/angular (FRA-116)
// import { ImportComponent } from '../import';
import { FormStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-form',
  template: `
    <!-- TODO: Export/Import moved to @smartsoft001-pro/angular (FRA-113, FRA-116) -->
    <!--@if (export || import) {
      <div style="text-align: right">
        @if (export) {
          <smart-export
            [value]="options()?.control?.value"
            [handler]="exportHandler"
          ></smart-export>
        }
        @if (import) {
          <smart-import
            (set)="onSetValue($event)"
            [accept]="importAccept"
          ></smart-import>
        }
      </div>
    }-->
    @if (form) {
      <form
        [formGroup]="form"
        (ngSubmit)="invokeSubmit.emit(form.value)"
        (keyup.enter)="invokeSubmit.emit(form.value)"
      >
        @if (componentType()) {
          <ng-container
            *ngComponentOutlet="componentType(); inputs: componentInputs()"
          />
        } @else {
          <smart-form-standard
            [options]="options()"
            [form]="form"
            [class]="cssClass()"
          ></smart-form-standard>
        }
      </form>
    }
  `,
  imports: [ReactiveFormsModule, FormStandardComponent, NgComponentOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent<T> implements OnDestroy {
  public exportProvider = inject(MODEL_EXPORT_PROVIDER, { optional: true });
  public importProvider = inject(MODEL_IMPORT_PROVIDER, { optional: true });
  private formFactory = inject(FormFactory);
  private cd = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  private injectedComponent = inject(FORM_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  private _options!: IFormOptions<T>;
  private _subscription = new Subscription();
  private _mode!: 'create' | 'update' | string;
  private _uniqueProvider!: (values: Record<keyof T, any>) => Promise<boolean>;

  form!: SmartFormGroup;
  export!: boolean;
  exportHandler!: (val: any) => void;
  import!: boolean;
  importAccept!: string | undefined;

  options = input.required<IFormOptions<T>>();
  cssClass = input<string>('', { alias: 'class' });

  invokeSubmit = output();
  valueChange = output<T>();
  valuePartialChange = output<Partial<T>>();
  validChange = output<boolean>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    form: this.form,
    class: this.cssClass(),
  }));

  constructor() {
    effect(() => {
      const options = this.options();
      if (!options) return;

      if (!options.treeLevel) options.treeLevel = 1;
      (this.elementRef.nativeElement as HTMLElement).setAttribute(
        'tree-level',
        options.treeLevel.toString(),
      );

      this._options = options;

      this.initLoading();
      this.initExportImport();

      this._mode = options?.mode ?? 'create';
      if (options?.uniqueProvider) {
        this._uniqueProvider = options.uniqueProvider;
      }

      if (options.control) {
        this.form = options.control as SmartFormGroup;
        this.registerChanges();
        this.cd.detectChanges();
      } else {
        this.formFactory
          .create(this._options.model, {
            mode: this._mode,
            uniqueProvider: this._uniqueProvider as (
              values: Record<string, any>,
            ) => Promise<boolean>,
          })
          .then((res) => {
            this.form = res;
            this.registerChanges();
            this.cd.detectChanges();
          });
      }
    });
  }

  async onSetValue(file: File): Promise<void> {
    const result = await this.importProvider?.convert(
      (this._options.model as any).constructor as Type<any>,
      file,
    );

    this._options.model = ObjectService.createByType(
      result,
      (this.options().model as any).constructor,
    );

    this.formFactory
      .create(this._options.model, {
        mode: this._mode,
        uniqueProvider: this._uniqueProvider as (
          values: Record<string, any>,
        ) => Promise<boolean>,
      })
      .then((res) => {
        this.form.setForm(res);
        this.registerChanges();
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  private initLoading(): void {
    if (this._options.loading$) {
      this._subscription.add(
        this._options.loading$
          .pipe(filter(() => !!this.form))
          .subscribe((val) => {
            if (val) {
              this.form.disable();
            } else {
              this.form.enable();
            }
          }),
      );
    }
  }

  private registerChanges(): void {
    this._subscription.add(
      this.form.valueChanges.subscribe(() => {
        this.validChange.emit(this.form.valid);
        this.valueChange.emit(this.form.value);

        const partialModel = {} as Partial<T>;
        Object.keys(this.form.controls)
          .filter(
            (key) => !key.endsWith('Confirm') && this.form.controls[key].dirty,
          )
          .forEach((key: string) => {
            (partialModel as any)[key] = this.form.controls[key].value;
          });

        this.valuePartialChange.emit(partialModel);
      }),
    );

    this.form.updateValueAndValidity();
  }

  private async initExportImport() {
    const modelOptions = getModelOptions(
      (this._options.model as any).constructor,
    );
    if (modelOptions.export && !this.exportProvider) {
      console.error('exportProvider is not provided');
    }

    if (modelOptions.import && !this.importProvider) {
      console.error('importProvider is not provided');
    }

    this.export = (modelOptions?.export ?? false) && !!this.exportProvider;
    this.import = (modelOptions?.import ?? false) && !!this.importProvider;

    if (this.import) {
      this.importAccept = await this.importProvider?.getAccept(
        (this._options.model as any).constructor as Type<any>,
      );
      if (this.importProvider) this.cd.detectChanges();
    }

    if (this.export) {
      this.exportHandler = (val) => {
        this.exportProvider?.execute(
          (this._options.model as any).constructor as Type<any>,
          val,
        );
      };
    }

    this.cd.detectChanges();
  }
}
