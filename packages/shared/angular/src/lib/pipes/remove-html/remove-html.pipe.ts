import { Pipe, PipeTransform } from '@angular/core';

import { RemoveHtmlService } from '@smartsoft001/utils';

@Pipe({
  name: 'smartRemoveHtml',
  standalone: true,
})
export class RemoveHtmlPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    return RemoveHtmlService.create(value);
  }
}
