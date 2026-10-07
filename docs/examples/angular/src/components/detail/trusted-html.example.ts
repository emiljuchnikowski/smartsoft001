// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  DetailComponent,
  ICellPipe,
  IDetailOptions,
} from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({})
class ProductModel {
  // HTML as the rich-text editor stores it, with an inline style.
  @Field({ details: true, type: FieldType.text })
  description = '<span style="color: red">Limited edition</span>';
}

/**
 * The text renderer of `<smart-detail>` lets Angular's sanitizer clean every
 * value, which also removes inline `style` attributes. A cellPipe that
 * returns `SafeHtml` opts one field out. Use it only for HTML you produce or
 * have sanitized yourself. `ICellPipe.transform` is typed as `string`, hence
 * the cast.
 */
@Injectable()
export class TrustedDescriptionCellPipe implements ICellPipe<ProductModel> {
  private readonly sanitizer = inject(DomSanitizer);

  transform(item: ProductModel): string {
    return this.sanitizer.bypassSecurityTrustHtml(
      item.description,
    ) as unknown as string;
  }
}

@Component({
  selector: 'docs-detail-trusted-html-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DetailComponent],
  providers: [TrustedDescriptionCellPipe],
  template: `
    <smart-detail data-testid="sanitized" [type]="type" [options]="sanitized" />
    <smart-detail data-testid="trusted" [type]="type" [options]="trusted" />
  `,
})
export class DetailTrustedHtmlExampleComponent {
  type = ProductModel;

  private readonly item = signal(new ProductModel());

  // Rendered without the style: the sanitizer strips it.
  sanitized: IDetailOptions<ProductModel> = {
    key: 'description',
    options: { type: FieldType.text },
    item: this.item,
  };

  // Rendered with the style: the cellPipe marks the value as trusted.
  trusted: IDetailOptions<ProductModel> = {
    ...this.sanitized,
    cellPipe: inject(TrustedDescriptionCellPipe),
  };
}
// #endregion
