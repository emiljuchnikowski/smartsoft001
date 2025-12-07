import { NgModule } from '@angular/core';

import { SharedComponentsModule } from '../components/components.module';
import { SharedDirectivesModule } from '../directives';
import { SharedServicesModule } from '../services';
import { DetailsPage } from './details/details.page';

const COMPONENTS = [DetailsPage];

@NgModule({
  imports: [
    SharedServicesModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    COMPONENTS,
  ],
  declarations: [],
  exports: [...COMPONENTS],
})
export class SharedPagesModule {}
