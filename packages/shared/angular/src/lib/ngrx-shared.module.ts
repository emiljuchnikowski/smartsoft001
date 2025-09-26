import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ErrorEffects } from './+state/error.effects';
import { NgrxStoreService } from './services';
import { SharedModule } from './shared.module';

@NgModule({
  providers: [NgrxStoreService],
  imports: [SharedModule, EffectsModule.forFeature([ErrorEffects])],
})
export class NgrxSharedModule {
  constructor(store: Store<any>, storeService: NgrxStoreService) {
    storeService.connect(store);
  }
}
