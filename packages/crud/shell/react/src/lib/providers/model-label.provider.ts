import {
  IModelLabelOptions,
  IModelLabelProvider,
  SmartTranslateFn,
} from '@smartsoft001/react';

/**
 * The label provider of a CRUD feature: delegates to the application's
 * provider when there is one, otherwise translates `MODEL.<key>`.
 */
export class CrudModelLabelProvider extends IModelLabelProvider {
  constructor(
    private readonly translate: SmartTranslateFn,
    private readonly parent: IModelLabelProvider | null = null,
  ) {
    super();
  }

  override get(options: IModelLabelOptions): string {
    if (this.parent) {
      const result = this.parent.get(options);

      if (result) return result;
    }

    return this.translate('MODEL.' + options.key);
  }
}
