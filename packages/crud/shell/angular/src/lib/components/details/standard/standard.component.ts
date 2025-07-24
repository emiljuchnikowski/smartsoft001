import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";

import { DetailsBaseComponent } from "../base/base.component";
import { IEntity } from "@smartsoft001/domain-core";

@Component({
  selector: "smart-details-standard",
  templateUrl: "./standard.component.html",
  styleUrls: ["./standard.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailsStandardComponent<T extends IEntity<string>>
  extends DetailsBaseComponent<T>
  implements OnInit {
  ngOnInit() {}
}
