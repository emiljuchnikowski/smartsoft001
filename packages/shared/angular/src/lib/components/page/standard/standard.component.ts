import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { SearchbarComponent } from '../../searchbar';
import { PageBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-page-standard',
  templateUrl: './standard.component.html',
  imports: [TranslatePipe, SearchbarComponent, AsyncPipe, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageStandardComponent extends PageBaseComponent {}
