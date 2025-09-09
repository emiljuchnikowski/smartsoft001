import { NgModule } from '@angular/core';

import { SharedServicesModule } from '../services';
import { DetailsPage } from './details/details.page';
import { SharedComponentsModule } from '../components/components.module';
import { SharedDirectivesModule } from '../directives';

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
