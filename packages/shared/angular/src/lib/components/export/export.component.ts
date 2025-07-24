import {ChangeDetectionStrategy, Component, Input} from "@angular/core";

@Component({
    selector: "smart-export",
    templateUrl: "./export.component.html",
    styleUrls: ["./export.component.scss"]
})
export class ExportComponent {

    @Input() value: any;
    @Input() fileName: string;
    @Input() handler: (value) => void;

    constructor() { }

    async onClick(): Promise<void> {
        if (this.handler) {
            this.handler(this.value);
            return;
        }

        // this.download(
        //     JSON.stringify(this.value, null, "\t"),
        //     (this.fileName ? this.fileName : 'data') + '.json',
        //     'application/json'
        // );
    }

    // private download(text, name, type): void {
    //     const file = new Blob([text], {type: type});
    //     // @ts-ignore
    //     const isIE = /*@cc_on!@*/false || !!document.documentMode;
    //     if (isIE) {
    //         window.navigator.msSaveOrOpenBlob(file, name);
    //     } else {
    //         const a = document.createElement('a');
    //         a.href = URL.createObjectURL(file);
    //         a.download = name;
    //         a.click();
    //     }
    // }
}
