import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'smartTrustHtml',
})
export class TrustHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(val: string): SafeHtml {
    if (!val) return val;
    return this.sanitizer.bypassSecurityTrustHtml(val);
  }
}
