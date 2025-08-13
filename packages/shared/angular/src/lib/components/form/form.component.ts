import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactoryResolver, ElementRef,
  EventEmitter, Inject,
  Input, NgModuleRef, OnDestroy, Optional,
  Output, QueryList, TemplateRef,
  Type, ViewChild, ViewChildren, ViewContainerRef,
} from "@angular/core";
import {Subscription} from "rxjs";
import {filter} from "rxjs/operators";
import { ReactiveFormsModule } from '@angular/forms';

import {getModelFieldsWithOptions, getModelOptions} from "@smartsoft001/models";
import {ObjectService} from "@smartsoft001/utils";

import { IFormOptions } from '../../models';
import {FormFactory} from '../../factories';
import {IModelExportProvider, MODEL_EXPORT_PROVIDER} from '../../providers';
import {IModelImportProvider, MODEL_IMPORT_PROVIDER} from '../../providers';
import {SmartFormGroup} from '../../services';
import {FormBaseComponent} from "./base/base.component";
import {CreateDynamicComponent} from '../base';
import {DynamicContentDirective} from '../../directives';
import { ExportComponent } from '../export';
import { ImportComponent } from '../import';
import { FormStepperComponent } from './stepper/stepper.component';
import { FormStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-form',
  template: `
    @if (export || import) {
      <div style="text-align: right">
        @if (export) {
          <smart-export [value]="options?.control?.value"
                        [handler]="exportHandler"
          ></smart-export>
        }
        @if (import) {
          <smart-import (set)="onSetValue($event)"
                        [accept]="importAccept"
          ></smart-import>
        }
      </div>
    }
    @if (form) {
      <form [formGroup]="form" (ngSubmit)="invokeSubmit.emit(form.value)"
            (keyup.enter)="invokeSubmit.emit(form.value)">
        @if (template() === 'default') {
          @if (options && type === 'standard') {
            <smart-form-standard
              [options]="options"
              [form]="form"
              (invokeSubmit)="invokeSubmit.emit($event)"
            ></smart-form-standard>
          }

          @if (options && type === 'stepper') {
            <smart-form-stepper
              [options]="options"
              [form]="form"
              (invokeSubmit)="invokeSubmit.emit($event)"
            ></smart-form-stepper>
          }
        }

        <div class="dynamic-content"></div>
      </form>
    }
  `,
  imports: [
    ExportComponent,
    ImportComponent,
    ReactiveFormsModule,
    FormStepperComponent,
    FormStandardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent<T> extends CreateDynamicComponent<FormBaseComponent<any>>("form") implements OnDestroy {
  private _options!: IFormOptions<T>;
  private _subscription = new Subscription();
  private _mode!: "create" | "update" | string;
  private _uniqueProvider!: (values: Record<keyof T, any>) => Promise<boolean>;

  form!: SmartFormGroup;
  type!: "standard" | "stepper" | "custom";
  export!: boolean;
  exportHandler!: (val: any) => void;
  import!: boolean;
  importAccept!: string;

  @ViewChild("customTpl", { read: ViewContainerRef, static: false })
  customTpl!: ViewContainerRef;

  @Input() set options(val: IFormOptions<T>) {
    if (!val) return;

    if (!val.treeLevel) val.treeLevel = 1;
    (this.elementRef.nativeElement as HTMLElement).setAttribute('tree-level', val.treeLevel.toString());

    this._options = val;

    this.initLoading();
    this.initType();

    this.initExportImport();

    this._mode = val?.mode ?? "create";
    if (val?.uniqueProvider) {
      this._uniqueProvider = val.uniqueProvider;
    }

    if (val.control) {
      this.form = val.control as SmartFormGroup;
      this.registerChanges();
      this.cd.detectChanges();
    } else {
      this.formFactory.create(this._options.model, {
        mode: this._mode,
        uniqueProvider: this._uniqueProvider as (values: Record<string, any>) => Promise<boolean>
      })
          .then(res => {
            this.form = res;
            this.registerChanges();
            this.cd.detectChanges();
          });
    }

    setTimeout(() => {
      this.refreshDynamicInstance();
    });
  }

  get options(): IFormOptions<T> {
    return this._options;
  }

  @Output() invokeSubmit = new EventEmitter();
  @Output() valueChange = new EventEmitter<T>();
  @Output() valuePartialChange = new EventEmitter<Partial<T>>();
  @Output() validChange = new EventEmitter<boolean>();

  @ViewChild("contentTpl", { read: TemplateRef, static: false })
  override contentTpl!: TemplateRef<any>;

  @ViewChildren(DynamicContentDirective, { read: DynamicContentDirective })
  override dynamicContents = new QueryList<DynamicContentDirective>();

  constructor(
      private formFactory: FormFactory,
      private cd: ChangeDetectorRef,
      private elementRef: ElementRef,
      @Optional()
      @Inject(MODEL_EXPORT_PROVIDER) public exportProvider: IModelExportProvider,
      @Optional()
      @Inject(MODEL_IMPORT_PROVIDER) public importProvider: IModelImportProvider,
      private moduleRef: NgModuleRef<any>,
      private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(cd, moduleRef, componentFactoryResolver);
  }

  async onSetValue(file: File): Promise<void> {
    let result;

    result = await this.importProvider.convert(this._options.model.constructor as Type<any>, file);

    this._options.model = ObjectService.createByType(result, this.options.model.constructor);

    this.formFactory.create(this._options.model, {
      mode: this._mode,
      uniqueProvider: this._uniqueProvider as (values: Record<string, any>) => Promise<boolean>
    })
        .then(res => {
          this.form.setForm(res);
          this.registerChanges();
          this.cd.detectChanges();
        });
  }

  override refreshProperties(): void {
    this.baseInstance.options = this.options;
    this.baseInstance.form = this.form;
    this._subscription.add(this.baseInstance.invokeSubmit.subscribe(e => this.invokeSubmit.emit(e)));
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this._subscription){
      this._subscription.unsubscribe();
    }
  }

  private initLoading(): void {
    if (this._options.loading$) {
      this._subscription.add(this._options.loading$
          .pipe(filter(() => !!this.form))
          .subscribe(val => {
            if (val) {
              this.form.disable();
            } else {
              this.form.enable();
            }
          }));
    }
  }

  private registerChanges(): void {
    this._subscription.add(this.form.valueChanges.subscribe(() => {
      this.validChange.emit(this.form.valid);
      this.valueChange.emit(this.form.value);

      const partialModel = {} as Partial<T>;
      Object.keys(this.form.controls)
          .filter(key => !key.endsWith('Confirm') && this.form.controls[key].dirty)
          .forEach((key: string) => {
            (partialModel as any)[key] = this.form.controls[key].value;
          });

      this.valuePartialChange.emit(partialModel);
    }));

    this.form.updateValueAndValidity();
  }

  private initType() {
    const fieldWithOptions = getModelFieldsWithOptions(this._options.model);

    if (fieldWithOptions.some(fwo => fwo.options.step)) {
      this.type = "stepper";
      return;
    }

    this.type = 'standard';
  }

  private async initExportImport() {
    const modelOptions = getModelOptions(this._options.model.constructor);
    if (modelOptions.export && !this.exportProvider) {
      console.error("exportProvider is not provided");
    }

    if (modelOptions.import && !this.importProvider) {
      console.error("importProvider is not provided");
    }

    this.export = (modelOptions?.export ?? false) && !!this.exportProvider;
    this.import = (modelOptions?.import ?? false) && !!this.importProvider;

    if (this.import) {
      this.importAccept = await this.importProvider.getAccept(this._options.model.constructor as Type<any>);
      if (this.importProvider) this.cd.detectChanges();
    }

    if (this.export) {
      this.exportHandler = val => {
        this.exportProvider.execute(this._options.model.constructor as Type<any>, val);
      }
    }

    this.cd.detectChanges();
  }
}
