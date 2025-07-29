import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  NgModuleRef,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import * as _ from 'lodash';
import { IonCol, IonRow } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';

import { getModelFieldsWithOptions, IFieldListMetadata } from '@smartsoft001/models';

import { IListInternalOptions, IListOptions, ListMode } from '../../models';
import { HardwareService } from '../../services';
import { CreateDynamicComponent } from '../base';
import { ListBaseComponent } from './base/base.component';
import { DynamicContentDirective } from '../../directives';
import { ListDesktopComponent } from './desktop/desktop.component';
import { ListMobileComponent } from './mobile/mobile.component';
import { ListMasonryGridComponent } from './masonry-grid/masonry-grid.component';
import { LoaderComponent } from '../loader';

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
    AsyncPipe,
    NgTemplateOutlet,
    LoaderComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent<T> extends CreateDynamicComponent<ListBaseComponent<any>>('list') implements OnInit {
  private _options!: IListInternalOptions<T>;

  mode: ListMode = ListMode.desktop;

  ListMode = ListMode;

  @Input() set options(val: IListOptions<T>) {
    this._options = val;
    this.initFields();
    this.initModel();
    this.refreshDynamicInstance();
  }

  get internalOptions(): IListInternalOptions<T> {
    return this._options;
  }

  @ViewChild("contentTpl", { read: TemplateRef, static: false })
  override contentTpl!: TemplateRef<any>;

  @ViewChildren(DynamicContentDirective, { read: DynamicContentDirective })
  override dynamicContents = new QueryList<DynamicContentDirective>();

  constructor(
      private hardwareService: HardwareService,
      private cd: ChangeDetectorRef,
      private moduleRef: NgModuleRef<any>,
      private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(cd, moduleRef, componentFactoryResolver);
  }

  ngOnInit() {

  }

  override refreshProperties(): void {
    this.baseInstance.options = this.internalOptions;
  }

  private initFields(): void {
    this._options.fields = _.sortBy(
        getModelFieldsWithOptions(new this._options.type()).filter(item => item?.options?.list),
        item => (item?.options?.list as IFieldListMetadata).order
    );
  }

  private initModel(): void {
    if (this._options.mode) {
      this.mode = this._options.mode;
    } else {
      this.mode = this.hardwareService.isMobile ? ListMode.mobile : ListMode.desktop
    }
  }
}
