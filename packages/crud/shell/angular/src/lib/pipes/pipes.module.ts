import { NgModule } from '@angular/core';

import { FormOptionsPipe } from './form-options/form-options.pipe';

@NgModule({
  exports: [FormOptionsPipe],
  imports: [
    FormOptionsPipe
  ]
})
export class CrudPipesModule {}
