import {
    AfterViewInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component, ComponentFactoryResolver, ComponentRef,
    ElementRef,
    Input, NgModuleRef,
    OnInit, QueryList,
    Renderer2, TemplateRef, ViewChild, ViewChildren, ViewContainerRef,
} from "@angular/core";
import { NgTemplateOutlet } from '@angular/common';

import {IPageOptions} from "../../models/interfaces";
import {DynamicContentDirective} from "../../directives/dynamic-content/dynamic-content.directive";
import {PageBaseComponent} from "./base/base.component";
import {CreateDynamicComponent} from "../base";
import { PageStandardComponent } from './standard/standard.component';

@Component({
    selector: 'smart-page',
    template: `
        @if (template === 'default') {
            <smart-page-standard [options]="options">
                <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
            </smart-page-standard>
        }
        <ng-template #contentTpl>
            <ng-content></ng-content>
        </ng-template>
        <div class="dynamic-content"></div>
    `,
    imports: [
        PageStandardComponent,
        NgTemplateOutlet
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent extends CreateDynamicComponent<PageBaseComponent>('page') implements OnInit {
    private _options: IPageOptions | null = null;

    @Input() set options(val: IPageOptions) {
        this._options = val;
        this.refreshDynamicInstance();
    }
    get options(): IPageOptions | null {
        return this._options;
    }

    @ViewChild("contentTpl", { read: TemplateRef, static: false })
    override contentTpl: TemplateRef<any> | ViewContainerRef | null = null;

    @ViewChildren(DynamicContentDirective, { read: DynamicContentDirective })
    override dynamicContents: QueryList<DynamicContentDirective> = new QueryList<DynamicContentDirective>();

    constructor(
        private el: ElementRef,
        private cd: ChangeDetectorRef,
        private renderer: Renderer2,
        private moduleRef: NgModuleRef<any>,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        super(cd, moduleRef, componentFactoryResolver);
    }

    ngOnInit() {
        this.renderer.setStyle(this.el.nativeElement, 'height', '100%');
    }

    override refreshProperties(): void {
        this.baseInstance.options = this.options;
    }
}
