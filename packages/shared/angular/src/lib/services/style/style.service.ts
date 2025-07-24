import {ElementRef, Inject, Injectable, PLATFORM_ID} from "@angular/core";
import { Platform } from '@ionic/angular';
import {isPlatformBrowser} from "@angular/common";

import {IStyle, StyleType} from "../../models/style";

@Injectable()
export class StyleService {
    static style: IStyle = null;

    private _elementRef: ElementRef;

    static create(platform: Platform, platformId: Object, el: ElementRef, style?: Partial<IStyle>): StyleService {
        const result = new StyleService(platform, platformId);

        result.init(el, style);

        return result;
    }

    constructor(private platform: Platform, @Inject(PLATFORM_ID) private platformId: Object) {
    }

    init(el: ElementRef, style?: Partial<IStyle>): void {
        this._elementRef = el;
        this.set(style);
    }

    set(style?: Partial<IStyle>): void {
        if (!style) style = {};

        if (!StyleService.style) StyleService.style = {};

        StyleService.style = {
            ...StyleService.style,
            ...style
        };

        this.execute();
    }

    private execute(): void {
        this.setColor('primary');
        this.setColor('secondary');
        this.setColor('tertiary');
        this.setColor('success');
        this.setColor('warning');
        this.setColor('danger');
        this.setColor('dark');
        this.setColor('medium');
        this.setColor('light');

        this.setFont();
        this.setButton();
        this.setMobileBreakpoint();
    }

    private setColor(name: string): void {
        this.setProperty(`--smart-color-${name}`, `color-${name}` as StyleType);
        this.setProperty(`--smart-color-${name}-rgb`, `color-${name}-rgb` as StyleType);
        this.setProperty(`--smart-color-${name}-contrast`, `color-${name}-contrast` as StyleType);
        this.setProperty(`--smart-color-${name}-contrast-rgb`, `color-${name}-contrast-rgb` as StyleType);
        this.setProperty(`--smart-color-${name}-shade`, `color-${name}-shade` as StyleType);
        this.setProperty(`--smart-color-${name}-tint`, `color-${name}-tint` as StyleType);

        this.setProperty(`--ion-color-${name}`, `color-${name}` as StyleType);
        this.setProperty(`--ion-color-${name}-rgb`, `color-${name}-rgb` as StyleType);
        this.setProperty(`--ion-color-${name}-contrast`, `color-${name}-contrast` as StyleType);
        this.setProperty(`--ion-color-${name}-contrast-rgb`, `color-${name}-contrast-rgb` as StyleType);
        this.setProperty(`--ion-color-${name}-shade`, `color-${name}-shade` as StyleType);
        this.setProperty(`--ion-color-${name}-tint`, `color-${name}-tint` as StyleType);
    }

    private setProperty(property: string, type: StyleType): void {
        if (!StyleService.style[type]) return;

        const native: HTMLElement = this._elementRef.nativeElement;
        native.style.setProperty(property, StyleService.style[type]);
    }

    private setFont(): void {
        if (isPlatformBrowser(this.platformId) && this.platform.is('ios')) {
            this.setProperty('--ion-font-family', 'ios-font');
            this.setProperty('--default-font-weight', 'ios-font-weight');
            this.setProperty('--default-font-style', 'ios-font-style');
        } else if (isPlatformBrowser(this.platformId) && this.platform.is("android")) {
            this.setProperty('--ion-font-family', 'md-font');
            this.setProperty('--default-font-weight', 'md-font-weight');
            this.setProperty('--default-font-style', 'md-font-style');
        } else {
            this.setProperty('--ion-font-family', 'font');
            this.setProperty('--default-font-weight', 'font-weight');
            this.setProperty('--default-font-style', 'font-style');
        }
    }

    private setButton(): void {
        this.setProperty('--smart-button-height', 'button-height');
        this.setProperty('--smart-button-min-width', 'button-min-width');
        this.setProperty('--smart-button-padding-right', 'button-padding-right');
        this.setProperty('--smart-button-padding-left', 'button-padding-left');
        this.setProperty('--smart-button-padding-top', 'button-padding-top');
        this.setProperty('--smart-button-padding-bottom', 'button-padding-bottom');
        this.setProperty('--smart-button-icon-size', 'button-icon-size');
    }

    private setMobileBreakpoint(): void {
        this.setProperty('--phone-breakpoint', 'phone-breakpoint');
        this.setProperty('--tablet-breakpoint', 'tablet-breakpoint');
    }
}
