import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Output,
    Renderer2,
    ViewChild,
    AfterViewInit, Input
} from "@angular/core";

@Component({
    selector: "smart-import",
    templateUrl: "./import.component.html",
    styleUrls: ["./import.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent implements AfterViewInit {
    @Input() accept = "application/json";

    @Output() set = new EventEmitter<File>();

    @ViewChild('inputObj', { read: ElementRef }) inputElementRef: ElementRef;

    constructor(private renderer: Renderer2) { }

    async onClick(): Promise<void> {
        (this.inputElementRef.nativeElement as HTMLInputElement).click();
    }

    ngAfterViewInit(): void {
        this.renderer.listen(this.inputElementRef.nativeElement, 'change', () => {
            const file: File = (this.inputElementRef.nativeElement as HTMLInputElement).files[0];

            (this.inputElementRef.nativeElement as HTMLInputElement).type = 'text';
            (this.inputElementRef.nativeElement as HTMLInputElement).type = 'file';

            this.set.next(file);
        });
    }
}
