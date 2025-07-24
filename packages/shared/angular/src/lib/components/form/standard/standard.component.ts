import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {FormBaseComponent} from "../base/base.component";

@Component({
  selector: 'smart-form-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormStandardComponent<T> extends FormBaseComponent<T> implements OnInit {

  ngOnInit() {
  }

}
