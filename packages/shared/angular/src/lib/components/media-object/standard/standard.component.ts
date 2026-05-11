import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { MediaObjectBaseComponent } from '../base';

@Component({
  selector: 'smart-media-object-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaObjectStandardComponent extends MediaObjectBaseComponent {}
