import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smartEnumToList'
})
export class EnumToListPipe implements PipeTransform {

  transform(value: any): Array<string> {
    if (!value) return value;
    return Object.keys(value);
  }

}
