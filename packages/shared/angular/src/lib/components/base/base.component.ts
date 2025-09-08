import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Directive,
  DoCheck, inject,
  NgModuleRef,
  OnDestroy,
  Signal,
  signal,
  TemplateRef,
  ViewContainerRef,
  WritableSignal
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MonoTypeOperatorFunction, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DynamicContentDirective } from '../../directives';
import { DynamicComponentType } from '../../models';
import { DynamicComponentStorageService } from '../../services';

@Directive()
export abstract class BaseComponent implements OnDestroy {
  get takeUntilDestroy(): MonoTypeOperatorFunction<any> {
    return takeUntil(this.destroy$);
  }

  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

export interface IDynamicComponent<T> extends BaseComponent {
  baseInstance: T;
  template: WritableSignal<'custom' | 'default'>;

  contentTpl: Signal<TemplateRef<any> | ViewContainerRef | undefined>;
  dynamicContents: Signal<readonly DynamicContentDirective[]>;

  refreshProperties(): void;
  refreshDynamicInstance(): void;
}

export function CreateDynamicComponent<
  T extends { contentTpl: Signal<TemplateRef<any> | ViewContainerRef | undefined>} = any,
>(
  type: DynamicComponentType,
): new () => IDynamicComponent<T> {
  @Directive()
  abstract class Component extends BaseComponent implements DoCheck {
    private cd = inject(ChangeDetectorRef);
    private moduleRef = inject(NgModuleRef<any>);
    private componentFactoryResolver = inject(ComponentFactoryResolver);

    private _renderCustom = false;
    private _findDynamicContent = false;

    baseInstance: T | null = null;

    dynamicType: Readonly<DynamicComponentType> = type;
    template: WritableSignal<'custom' | 'default'> = signal('default');

    abstract contentTpl: Signal<TemplateRef<any> | ViewContainerRef | undefined>;
    abstract dynamicContents: Signal<readonly DynamicContentDirective[]>;

    refreshDynamicInstance() {
      this.init();

      if (!this.baseInstance) return;
      this.refreshProperties();
    }

    abstract refreshProperties(): void;

    ngDoCheck(): void {
      if (this._findDynamicContent || !this.dynamicContents()) return;

      this._findDynamicContent = true;

      toObservable(this.dynamicContents).pipe(this.takeUntilDestroy).subscribe(() => {
        this.init();
      });
      this.init();
    }

    private init(): void {
      const component = DynamicComponentStorageService.get(
        this.dynamicType,
        this.moduleRef,
      )[0];
      this.template.set(component ? 'custom' : 'default');

      if (component && !this._renderCustom) {
        const factory =
          this.componentFactoryResolver.resolveComponentFactory(component);
        const first = this.dynamicContents()[0];
        if (first) {
          this._renderCustom = true;
          this.baseInstance =
            first.container.createComponent(
              factory,
            ).instance;
          this.refreshDynamicInstance();
          this.baseInstance?.contentTpl()?.createEmbeddedView(this.contentTpl());
        }
      }

      if (this.cd) this.cd.detectChanges();
    }
  }

  return Component as any;
}
