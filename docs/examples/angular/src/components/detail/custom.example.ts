// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import {
  DetailBaseComponent,
  DetailComponent,
  DETAIL_FIELD_COMPONENTS_TOKEN,
  IDetailOptions,
} from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

/**
 * A custom renderer for one detail field, built on `DetailBaseComponent`.
 *
 * The base supplies the `options` input (key, item signal, field metadata) and
 * the `class` input, and re-runs `afterSetOptionsHandler()` whenever the
 * options change. Everything else is the implementation's own template.
 */
@Component({
  selector: 'docs-custom-detail-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p [class]="classes()">{{ value() }}</p>`,
})
export class CustomDetailTextComponent extends DetailBaseComponent<
  Record<string, unknown>
> {
  value = computed(() => {
    const options = this.options();
    const item = options?.item?.();
    if (!options || !item) return '';
    return String(item[options.key] ?? '');
  });

  // `cssClass` is left aliased as `class` by the base — smart-detail forwards
  // the consumer's class under that name, so do not redeclare it here.
  classes = computed(() =>
    ['docs-detail-text', this.cssClass()].filter(Boolean).join(' '),
  );
}

@Model({})
class ApplicantModel {
  @Field({ details: true, type: FieldType.text })
  name = 'Margot Foster';
}

/**
 * `<smart-detail>` chooses the renderer from the field's `type`, so a custom
 * implementation is registered per FieldType through
 * `DETAIL_FIELD_COMPONENTS_TOKEN`. Entries are merged over the built-in map,
 * so only the listed types change.
 */
@Component({
  selector: 'docs-detail-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DetailComponent],
  providers: [
    {
      provide: DETAIL_FIELD_COMPONENTS_TOKEN,
      useValue: { [FieldType.text]: CustomDetailTextComponent },
    },
  ],
  template: `
    <smart-detail
      [type]="type"
      [options]="options"
      [class]="'docs-detail-text--demo'"
    />
  `,
})
export class DetailCustomExampleComponent {
  type = ApplicantModel;

  options: IDetailOptions<ApplicantModel> = {
    key: 'name',
    options: { type: FieldType.text },
    item: signal(new ApplicantModel()),
  };
}
// #endregion
