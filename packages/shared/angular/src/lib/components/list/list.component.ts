import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  NgModuleRef,
  QueryList,
  signal,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { IonCol, IonRow } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import * as _ from 'lodash';

import { IEntity } from '@smartsoft001/domain-core';
import {
  getModelFieldsWithOptions,
  IFieldListMetadata,
} from '@smartsoft001/models';

import { CreateDynamicComponent } from '../base';
import { ListBaseComponent } from './base/base.component';
import { DynamicContentDirective } from '../../directives';
import { IListInternalOptions, IListOptions, ListMode } from '../../models';
import { HardwareService } from '../../services';
import { LoaderComponent } from '../loader';
import { ListDesktopComponent } from './desktop/desktop.component';
import { ListMasonryGridComponent } from './masonry-grid/masonry-grid.component';
import { ListMobileComponent } from './mobile/mobile.component';

@Component({
  selector: 'smart-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../../styles/global.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    ListDesktopComponent,
    ListMobileComponent,
    ListMasonryGridComponent,
    IonRow,
    IonCol,
    TranslatePipe,
    NgTemplateOutlet,
    LoaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent<
  T extends IEntity<string>,
> extends CreateDynamicComponent<ListBaseComponent<any>>('list') {
  private _options!: WritableSignal<IListInternalOptions<T>>;

  mode: WritableSignal<ListMode> = signal<ListMode>(ListMode.desktop);

  ListMode = ListMode;

  @Input() set options(val: IListOptions<T>) {
    this._options.set(val);
    this.initFields();
    this.initModel();
    this.refreshDynamicInstance();
  }

  get internalOptions(): IListInternalOptions<T> {
    return this._options();
  }

  @ViewChild('contentTpl', { read: TemplateRef, static: false })
  override contentTpl!: TemplateRef<any>;

  @ViewChildren(DynamicContentDirective, { read: DynamicContentDirective })
  override dynamicContents = new QueryList<DynamicContentDirective>();

  constructor(
    private hardwareService: HardwareService,
    private cd: ChangeDetectorRef,
    private moduleRef: NgModuleRef<any>,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(cd, moduleRef, componentFactoryResolver);
  }

  override refreshProperties(): void {
    this.baseInstance.options = this.internalOptions;
  }

  private initFields(): void {
    this._options().fields = _.sortBy(
      getModelFieldsWithOptions(new (this._options() as any).type()).filter(
        (item) => item?.options?.list,
      ),
      (item) => (item?.options?.list as IFieldListMetadata).order,
    );
  }

  private initModel(): void {
    if (this._options()?.mode) {
      this.mode.set(this._options().mode!);
    } else {
      this.mode.set(
        this.hardwareService.isMobile ? ListMode.mobile : ListMode.desktop,
      );
    }
  }
}
