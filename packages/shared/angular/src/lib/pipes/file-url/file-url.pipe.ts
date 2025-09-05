import { Pipe, PipeTransform } from '@angular/core';

import { FileService } from '../../services';

@Pipe({
  name: 'smartFileUrl',
})
export class FileUrlPipe implements PipeTransform {
  constructor(private service: FileService) {}

  transform(file: { id: any }): string {
    return this.service.getUrl(file.id);
  }
}
