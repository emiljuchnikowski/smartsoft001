import {
    AfterViewInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component, ComponentFactoryResolver, ComponentRef,
    ElementRef,
    Input, NgModuleRef,
    OnInit, QueryList,
    Renderer2, TemplateRef, ViewChild, ViewChildren, ViewContainerRef,
} from "@angular/core";

import {IPageOptions} from "../../models/interfaces";
import {DynamicContentDirective} from "../../directives/dynamic-content/dynamic-content.directive";
import {PageBaseComponent} from "./base/base.component";
import {CreateDynamicComponent} from "../base";

@Component({
    selector: 'smart-page',
    template: `
        <smart-page-standard *ngIf="template === 'default'" [options]="options">
            <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
        </smart-page-standard>
        <ng-template #contentTpl>
            <ng-content></ng-content>
        </ng-template>
        <div class="dynamic-content"></div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent extends CreateDynamicComponent<PageBaseComponent>('page') implements OnInit {
    private _options: IPageOptions;

    @Input() set options(val: IPageOptions) {
        this._options = val;
        this.refreshDynamicInstance();
    }
    get options(): IPageOptions {
        return this._options;
    }

    @ViewChild("contentTpl", { read: TemplateRef, static: false })
    contentTpl: TemplateRef<any>;

    @ViewChildren(DynamicContentDirective, { read: DynamicContentDirective })
    dynamicContents = new QueryList<DynamicContentDirective>();

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

    refreshProperties(): void {
        this.baseInstance.options = this.options;
    }
}
