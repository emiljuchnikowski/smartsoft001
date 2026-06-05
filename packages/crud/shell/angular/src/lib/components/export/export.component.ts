import { Component } from '@angular/core';

import { ButtonComponent } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { ExportBaseComponent } from './base/base.component';

@Component({
  selector: 'smart-crud-export',
  template: `
    <div class="smart:p-5">
      <p class="smart:my-2.5 smart:mx-0">
        <smart-button
          [options]="buttonExportCsvOptions"
          class="smart:w-full smart:block"
          >CSV</smart-button
        >
      </p>
      <p>
        <smart-button
          [options]="buttonExportXlsxOptions"
          class="smart:w-full smart:block"
          >XLSX</smart-button
        >
      </p>
    </div>
  `,
  imports: [ButtonComponent],
})
export class ExportComponent<
  T extends IEntity<string>,
> extends ExportBaseComponent<T> {}
