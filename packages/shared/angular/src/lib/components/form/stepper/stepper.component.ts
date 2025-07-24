import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";

import {getModelFieldsWithOptions, IModelStep} from "@smartsoft001/models";
import {ArrayService} from "@smartsoft001/utils";

import {FormBaseComponent} from "../base/base.component";

@Component({
    selector: 'smart-form-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormStepperComponent<T> extends FormBaseComponent<T> implements OnInit {
    steps: Array<IModelStep & { fields: Array<string>, form: UntypedFormGroup }>;

    constructor(cd: ChangeDetectorRef, private fb: UntypedFormBuilder) {
        super(cd);
    }

    protected afterSetOptions() {
        super.afterSetOptions();
        this.initSteps();
    }

    protected afterSetForm() {
        super.afterSetForm();
        this.initSteps();
    }

    ngOnInit(): void {
    }

    private initSteps(): void {
        if (!this.model || !this.form) return;

        const fieldWithOptions = getModelFieldsWithOptions(this.model).filter(fwo => fwo.options.step);
        const steps: Array<IModelStep & { fields: Array<string>, form: UntypedFormGroup }> = [];

        ArrayService.sort(fieldWithOptions, fwo => fwo.options.step.number).forEach(fwo => {
            let step = steps.find(s => s.number === fwo.options.step.number);

            if (!step) {
                step = {
                    number: fwo.options.step.number,
                    name: fwo.options.step.name,
                    fields: [],
                    form: this.fb.group({})
                }

                steps.push(step)
            }

            step.fields.push(fwo.key);
            step.form.addControl(fwo.key, this.form.controls[fwo.key]);

            step.form.valueChanges.pipe(
                this.takeUntilDestroy
            ).subscribe(value => {
                this.form.setValue({
                    ...this.form.value,
                    ...value
                })
            })
        });

        this.steps = steps;
        this.cd.detectChanges();

        this.form.updateValueAndValidity();
    }
}
