import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'smart-import',
  template: `
    <!--<ion-button title="import" (click)="onClick()" slot="icon-only">-->
    <!--  <ion-icon name="cloud-upload"></ion-icon>-->
    <!--</ion-button>-->
    <input
      type="file"
      [accept]="accept ? accept : 'application/json'"
      [hidden]="true"
      #inputObj
    />
  `,
  styles: [
    `
      :host {
        cursor: pointer;
        font-size: 3rem;
        height: 3rem;
        margin: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportComponent implements AfterViewInit {
  @Input() accept = 'application/json';

  @Output() set = new EventEmitter<File>();

  @ViewChild('inputObj', { read: ElementRef }) inputElementRef!: ElementRef;

  constructor(private renderer: Renderer2) {}

  async onClick(): Promise<void> {
    (this.inputElementRef.nativeElement as HTMLInputElement).click();
  }

  ngAfterViewInit(): void {
    this.renderer.listen(this.inputElementRef.nativeElement, 'change', () => {
      const file: File | null =
        (this.inputElementRef.nativeElement as HTMLInputElement).files?.[0] ??
        null;

      (this.inputElementRef.nativeElement as HTMLInputElement).type = 'text';
      (this.inputElementRef.nativeElement as HTMLInputElement).type = 'file';

      if (file) {
        this.set.next(file);
      } else {
        throw Error('ImportComponent: File not found');
      }
    });
  }
}
