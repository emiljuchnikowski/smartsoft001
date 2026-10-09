// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  AvatarComponent,
  IAvatarItem,
  IAvatarOptions,
  SmartAvatarShape,
  SmartAvatarSize,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-avatar-usage-example',
  imports: [AvatarComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarUsageExampleComponent {
  readonly initials = 'JD';
  readonly size: SmartAvatarSize = 'lg';
  readonly shape: SmartAvatarShape = 'rounded';

  readonly team: IAvatarItem[] = [
    { id: 'u1', imageUrl: 'https://i.pravatar.cc/64?img=1' },
    { id: 'u2', imageUrl: 'https://i.pravatar.cc/64?img=2' },
    { id: 'u3', initials: 'AK' },
  ];

  readonly groupOptions: IAvatarOptions = { stackDirection: 'bottom-to-top' };
}
// #endregion
