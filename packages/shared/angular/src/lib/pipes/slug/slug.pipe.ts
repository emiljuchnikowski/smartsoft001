import { Pipe, PipeTransform } from '@angular/core';

import { SlugService } from '@smartsoft001/utils';

@Pipe({
  name: 'smartSlug',
  standalone: true,
})
export class SlugPipe implements PipeTransform {
  transform(value: string): string {
    return SlugService.create(value);
  }
}