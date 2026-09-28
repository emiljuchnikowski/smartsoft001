// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  IMediaObjectOptions,
  MediaObjectComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-media-object-usage-example',
  imports: [MediaObjectComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaObjectUsageExampleComponent {
  readonly avatarUrl = 'https://i.pravatar.cc/128?u=lindsay.walton';

  readonly options: IMediaObjectOptions = {
    alignment: 'center',
    position: 'left',
  };
}
// #endregion
