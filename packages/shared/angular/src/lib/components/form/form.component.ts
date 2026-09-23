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
  signal,
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
    @if (form; as currentForm) {
      <form
        [formGroup]="currentForm"
        (ngSubmit)="invokeSubmit.emit(currentForm.value)"
        (keyup.enter)="invokeSubmit.emit(currentForm.value)"
      >
        @if (componentType()) {
          <ng-container
            *ngComponentOutlet="componentType(); inputs: componentInputs()"
          />
        } @else {
          <smart-form-standard
            [options]="options()"
            [form]="currentForm"
            [class]="cssClass()"
          ></smart-form-standard>
        }
      </form>
    }
  `,
  imports: [ReactiveFormsModule, FormStandardComponent, NgComponentOutlet],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'smart:contents' },
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
  private _formSubscription = new Subscription();
  private _mode!: 'create' | 'update' | string;
  private _uniqueProvider!: (values: Record<keyof T, any>) => Promise<boolean>;
  // Counts the builds started so far, so a build that settles after a newer
  // one has already won can recognise itself as stale and step aside.
  private _build = 0;

  // The group lives in a signal: the body is rendered through
  // `componentInputs()`, and a plain field would leave that computed - and so
  // the rendered inputs - bound to the group of the previous build.
  private readonly _form = signal<SmartFormGroup | undefined>(undefined);

  get form(): SmartFormGroup | undefined {
    return this._form();
  }

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

      const build = ++this._build;

      if (options.control) {
        this._form.set(options.control as SmartFormGroup);
        this.registerChanges(options.control as SmartFormGroup);
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
            if (build !== this._build) return;

            this._form.set(res);
            this.registerChanges(res);
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
        const current = this.form;
        if (!current) return;

        current.setForm(res);
        this.registerChanges(current);
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this._formSubscription.unsubscribe();
  }

  private initLoading(): void {
    if (this._options.loading$) {
      this._subscription.add(
        this._options.loading$
          .pipe(filter(() => !!this.form))
          .subscribe((val) => {
            if (val) {
              this.form?.disable();
            } else {
              this.form?.enable();
            }
          }),
      );
    }
  }

  private registerChanges(form: SmartFormGroup): void {
    // Only the group currently rendered may emit, so the previous
    // subscription goes away before the new one is created.
    this._formSubscription.unsubscribe();
    this._formSubscription = new Subscription();

    this._formSubscription.add(
      form.valueChanges.subscribe(() => {
        this.validChange.emit(form.valid);
        this.valueChange.emit(form.value);

        const partialModel = {} as Partial<T>;
        Object.keys(form.controls)
          .filter((key) => !key.endsWith('Confirm') && form.controls[key].dirty)
          .forEach((key: string) => {
            (partialModel as any)[key] = form.controls[key].value;
          });

        this.valuePartialChange.emit(partialModel);
      }),
    );

    form.updateValueAndValidity();
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
