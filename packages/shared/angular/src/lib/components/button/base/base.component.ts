import {Directive, Input, ViewChild, ViewContainerRef} from "@angular/core";

import {DynamicComponentType, IButtonOptions} from "../../../models";

@Directive()
export abstract class ButtonBaseComponent {
    static smartType: DynamicComponentType = "button"

    mode: 'default' | 'confirm';

    @Input() options: IButtonOptions;
    @Input() disabled: boolean;

    @ViewChild("contentTpl", { read: ViewContainerRef, static: true })
    contentTpl: ViewContainerRef;

    invoke(): void {
        if (!this.options) return;

        if (this.options.confirm) {
            this.mode = 'confirm';
        } else {
            this.options.click();
        }
    }

    confirmInvoke(): void {
        if (!this.options) return;
        this.options.click();
        this.mode = 'default';
    }

    confirmCancel(): void {
        if (!this.options) return;
        this.mode = 'default';
    }
}