import {Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Pipe({
    name: 'smartTrustHtml'
})
export class TrustHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }

    transform(val: string): SafeHtml {
        if (!val) return val;
        return this.sanitizer.bypassSecurityTrustHtml(val);
    }
}