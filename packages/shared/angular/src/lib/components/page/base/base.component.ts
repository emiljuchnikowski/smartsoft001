import {
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    Directive,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";
import { Location } from '@angular/common';
import {PopoverController} from "@ionic/angular";
import { Subscription} from "rxjs";

import {DynamicComponentType, IIconButtonOptions, IPageOptions} from "../../../models/interfaces";
import {AppService} from "../../../services/app/app.service";
import { HardwareService } from "../../../services/hardware/hardware.service";

@Directive()
export abstract class PageBaseComponent implements OnInit, OnDestroy {
    static smartType: DynamicComponentType = "page";

    private _options: IPageOptions;
    private _subscriptions = new Subscription();

    @Input() set options(val: IPageOptions) {
        this._options = val;
    }
    get options(): IPageOptions {
        return this._options;
    }

    get isMobile(): boolean {
        return this.hardwareService.isMobile || this.hardwareService.isMobileWeb;
    }

    @ViewChild("contentTpl", { read: ViewContainerRef, static: true })
    contentTpl: ViewContainerRef;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private location: Location,
        private popover: PopoverController,
        public appService: AppService,
        public hardwareService: HardwareService,
    ) { }

    back(): void {
        this.location.back();
    }

    async presentPopover(ev: any, btn: IIconButtonOptions): Promise<void> {
        const instance = await this.popover.create({
            event: ev,
            component: btn.component,
            translucent: true
        });

        await instance.present();
    }

    ngOnInit() {
        this.renderer.setStyle(this.el.nativeElement, 'height', '100%');
    }

    ngOnDestroy(): void {
        if (this._subscriptions) {
            this._subscriptions.unsubscribe();
        }
    }
}
