import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  DESCRIPTION_LIST_ACTION_CLASSES,
  DESCRIPTION_LIST_ATTACHMENTS_CLASSES,
  DESCRIPTION_LIST_DESCRIPTION_CLASSES,
  DESCRIPTION_LIST_FOOTER_CLASSES,
  DESCRIPTION_LIST_ROW_CLASSES,
  DESCRIPTION_LIST_TERM_CLASSES,
  DESCRIPTION_LIST_TITLE_CLASSES,
  DESCRIPTION_LIST_VALUE_CLASSES,
  getDescriptionListListClasses,
} from './preset-classes.util';
import { DescriptionListStandardComponent } from '../standard/standard.component';

/**
 * Preset-styled description list.
 *
 * Drop-in replacement for `DescriptionListStandardComponent` — register it
 * through `DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN` to restyle every
 * `<smart-description-list>`, or use the `<smart-description-list-preset>`
 * selector directly.
 *
 * Renders an optional header (title + description), a divided `<dl>` of
 * label/value rows, and optional attachments/footer sections. Within a row
 * `valueTpl` wins over `value`, and `actionTpl` renders right-aligned.
 */
@Component({
  selector: 'smart-description-list-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class DescriptionListPresetComponent extends DescriptionListStandardComponent {
  // NgComponentOutlet (used by DescriptionListComponent when this is registered
  // through DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN) passes inputs by their
  // canonical name, so the inherited `class` alias is dropped here.
  override cssClass = input<string>('');

  protected readonly hasHeader = computed(
    () => !!this.options()?.title || !!this.options()?.description,
  );

  protected readonly listClasses = computed(() =>
    getDescriptionListListClasses(this.cssClass()),
  );

  protected readonly titleClasses = DESCRIPTION_LIST_TITLE_CLASSES;
  protected readonly descriptionClasses = DESCRIPTION_LIST_DESCRIPTION_CLASSES;
  protected readonly rowClasses = DESCRIPTION_LIST_ROW_CLASSES;
  protected readonly termClasses = DESCRIPTION_LIST_TERM_CLASSES;
  protected readonly valueClasses = DESCRIPTION_LIST_VALUE_CLASSES;
  protected readonly actionClasses = DESCRIPTION_LIST_ACTION_CLASSES;
  protected readonly attachmentsClasses = DESCRIPTION_LIST_ATTACHMENTS_CLASSES;
  protected readonly footerClasses = DESCRIPTION_LIST_FOOTER_CLASSES;
}
