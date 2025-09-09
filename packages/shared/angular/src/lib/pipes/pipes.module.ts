import { NgModule } from '@angular/core';

import { EnumToListPipe } from './enum-to-list/enum-to-list.pipe';
import { ListCellPipe } from './list-cell/list-cell.pipe';
import { ListHeaderPipe } from './list-header/list-header.pipe';
import { ModelLabelPipe } from './model-label/model-label.pipe';
import { TrustHtmlPipe } from './trust-html/trust-html.pipe';

export const PIPES = [
  ModelLabelPipe,
  ListCellPipe,
  TrustHtmlPipe,
  ListHeaderPipe,
  EnumToListPipe,
];

@NgModule({
  declarations: [],
  imports: [PIPES],
  exports: [...PIPES],
})
export class SharedPipesModule {}
