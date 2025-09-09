import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { TranslatePipe } from '@ngx-translate/core';

import { getModelFieldsWithOptions, IModelStep } from '@smartsoft001/models';
import { ArrayService } from '@smartsoft001/utils';

import { InputComponent } from '../../input';
import { FormBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-form-stepper',
  templateUrl: './stepper.component.html',
  imports: [
    MatStepper,
    MatStep,
    InputComponent,
    TranslatePipe,
    MatStepLabel,
    MatButton,
    MatStepperPrevious,
    MatStepperNext,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepperComponent<T> extends FormBaseComponent<T> {
  private fb = inject(UntypedFormBuilder);

  steps!: Array<IModelStep & { fields: Array<string>; form: UntypedFormGroup }>;

  protected override afterSetOptions() {
    this.initSteps();
  }

  protected override afterSetForm() {
    this.initSteps();
  }

  private initSteps(): void {
    if (!this.model || !this.form()) return;

    const fieldWithOptions = getModelFieldsWithOptions(this.model).filter(
      (fwo) => fwo.options.step,
    );
    const steps: Array<
      IModelStep & { fields: Array<string>; form: UntypedFormGroup }
    > = [];

    ArrayService.sort(
      fieldWithOptions,
      (fwo) => fwo.options.step?.number ?? 0,
    ).forEach((fwo) => {
      let step = steps.find((s) => s.number === fwo.options.step?.number);

      if (!step) {
        step = {
          number: fwo.options.step?.number ?? 0,
          name: fwo.options.step?.name ?? '',
          fields: [],
          form: this.fb.group({}),
        };

        steps.push(step);
      }

      step.fields.push(fwo.key);
      step.form.addControl(fwo.key, this.form().controls[fwo.key]);

      step.form.valueChanges.pipe(this.takeUntilDestroy).subscribe((value) => {
        this.form().setValue({
          ...this.form().value,
          ...value,
        });
      });
    });

    this.steps = steps;
    this.cd.detectChanges();

    this.form().updateValueAndValidity();
  }

  public __smartDisabled(field: string) {
    return (this.form().controls[field] as any)['__smartDisabled'];
  }
}
