import { Pipe, PipeTransform } from '@angular/core';

import { SlugService } from '@smartsoft001/utils';

@Pipe({
  name: 'smartSlug',
  standalone: true,
})
export class SlugPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    return SlugService.create(value);
  }
}
