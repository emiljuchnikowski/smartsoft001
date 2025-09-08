import {
  Directive,
  ElementRef, inject,
  OnInit,
  Renderer2,
  Signal,
  signal, viewChild,
  WritableSignal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { InputBaseComponent } from './base.component';
import { IButtonOptions } from '../../../models';
import { FileService, ToastService } from '../../../services';

@Directive()
export abstract class InputFileBaseComponent<T>
  extends InputBaseComponent<T>
  implements OnInit
{
  protected renderer = inject(Renderer2);
  protected fileService = inject(FileService);
  protected toastService = inject(ToastService);
  protected translateService = inject(TranslateService);

  valid = true;
  oldId!: number;
  file!: File | null;

  loading: WritableSignal<boolean> = signal(false);
  percent: Signal<number | undefined> = signal(undefined);

  addButtonOptions: IButtonOptions = {
    click: () => {
      this.control.markAsDirty();
      this.control.markAsTouched();
      (this.inputElementRef()?.nativeElement as HTMLInputElement).click();
    },
    loading: this.loading,
  };
  showButtonOptions: IButtonOptions = {
    click: () => {
      this.fileService.download(this.control.value.id);
    },
    loading: this.loading,
  };
  deleteButtonOptions: IButtonOptions = {
    click: () => {
      this.control.markAsDirty();
      this.control.markAsTouched();
      //this.fileService.delete(this.control.value.id);
      this.control.setValue(null);
      this.file = null;
    },
    loading: this.loading,
    confirm: true,
  };

  inputElementRef = viewChild<ElementRef | undefined>('inputObj');

  ngOnInit(): void {
    this.renderer.listen(this.inputElementRef()?.nativeElement, 'change', () => {
      this.loading.set(true);
      this.file =
        (this.inputElementRef()?.nativeElement as HTMLInputElement).files?.[0] ??
        null;

      (this.inputElementRef()?.nativeElement as HTMLInputElement).type = 'text';
      (this.inputElementRef()?.nativeElement as HTMLInputElement).type = 'file';

      if (
        (this.inputElementRef()?.nativeElement as HTMLInputElement).accept &&
        this.file &&
        this.file.name
      ) {
        const acceptTypes = (
          this.inputElementRef()?.nativeElement as HTMLInputElement
        ).accept
          .split(',')
          .map((type) => type.replace('.', ''));

        const fileType = this.file.name
          .substr(this.file.name.lastIndexOf('.') + 1)
          .toLowerCase();

        if (!acceptTypes.some((a) => a === fileType)) {
          this.toastService.error({
            duration: 3000,
            message:
              this.translateService.instant('INPUT.ERRORS.invalidFileType') +
              ` (${(this.inputElementRef()?.nativeElement as HTMLInputElement).accept})`,
          });
          this.loading.set(false);
          return;
        }
      }

      if (this.file) {
        this.percent = toSignal(
          this.fileService.upload(this.file, (res: object) => {
            this.control.setValue(res);
            this.loading.set(false);
          }),
        );
      }
    });
  }
}
