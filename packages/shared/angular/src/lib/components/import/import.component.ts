import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  AfterViewInit,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'smart-import',
  template: `
    <!--<ion-button title="import" (click)="onClick()" slot="icon-only">-->
    <!--  <ion-icon name="cloud-upload"></ion-icon>-->
    <!--</ion-button>-->
    <input
      type="file"
      [accept]="accept() ? accept() : 'application/json'"
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
  accept = input<string | undefined>('application/json');

  set = output<File>();

  inputElementRef = viewChild<ElementRef>('inputObj');

  constructor(private renderer: Renderer2) {}

  async onClick(): Promise<void> {
    (this.inputElementRef()?.nativeElement as HTMLInputElement)?.click();
  }

  ngAfterViewInit(): void {
    const elementRef = this.inputElementRef();
    if (elementRef) {
      this.renderer.listen(elementRef?.nativeElement, 'change', () => {
        const file: File | null =
          (elementRef?.nativeElement as HTMLInputElement).files?.[0] ?? null;

        (elementRef?.nativeElement as HTMLInputElement).type = 'text';
        (elementRef?.nativeElement as HTMLInputElement).type = 'file';

        if (file) {
          this.set.emit(file);
        } else {
          throw Error('ImportComponent: File not found');
        }
      });
    }
  }
}
