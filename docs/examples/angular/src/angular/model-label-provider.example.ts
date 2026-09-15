// #region usage
import { Injectable, Provider, Signal, signal } from '@angular/core';

import { IModelLabelOptions, IModelLabelProvider } from '@smartsoft001/angular';

/**
 * Labels the library should use instead of the default `MODEL.<key>` translation.
 */
const DOCS_LABELS: Record<string, string> = {
  email: 'Adres e-mail',
};

/**
 * `IModelLabelProvider` is an abstract class, so it doubles as its own DI token.
 * `ModelLabelPipe` injects it optionally and only uses the returned signal when
 * its value is truthy - returning an empty string hands the key back to the
 * built-in `TranslateService.instant('MODEL.' + key)` fallback.
 */
@Injectable()
export class DocsModelLabelProvider extends IModelLabelProvider {
  override get(options: IModelLabelOptions): Signal<string> {
    return signal(DOCS_LABELS[options.key] ?? '');
  }
}

export function provideDocsModelLabels(): Provider[] {
  return [{ provide: IModelLabelProvider, useClass: DocsModelLabelProvider }];
}
// #endregion
