import { UntypedFormGroup } from "@angular/forms";

export class SmartFormGroup extends UntypedFormGroup {
    static create(): SmartFormGroup {
        return new SmartFormGroup({});
    }

    setForm(form: UntypedFormGroup): void {
        Object.keys(form.controls).forEach(key => {
            if (this.controls[key]) this.removeControl(key);
            this.addControl(key, form.controls[key]);
        });
    }
}