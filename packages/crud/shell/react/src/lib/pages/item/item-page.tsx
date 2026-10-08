import { IEntity } from '@smartsoft001/domain-core';
import { SmartPage, useSmartComponent } from '@smartsoft001/react';

import {
  SmartCrudItemPageBodyProps,
  SmartCrudItemPageProps,
} from './item-page.types';
import { SmartCrudItemPageStandard } from './standard/item-page-standard';
import { useCrudItemPage } from './use-crud-item-page';

/**
 * `<smart-crud-item-page>` (the Angular `ItemComponent` of the
 * `CrudFullModule` `add` and `:id` routes): a `SmartPage` with the title,
 * back button and mode buttons of `useCrudItemPage`, the add / edit
 * components above and below the body, and the body: the one registered as
 * `components['crud-item-page']` on `SmartProvider` (the Angular
 * `crud-item-page` dynamic component), else `SmartCrudItemPageStandard`.
 * Without `id` it creates an item. Render it inside the feature's
 * `CrudProvider` with a `CrudFullConfig`.
 *
 * Like the Angular page, a registered body renders in the `.dynamic-content`
 * element. It gets the same props as the standard one and must put the form
 * it renders in `formRef` (see `useCrudItemPageBase`), or add and save do
 * nothing.
 */
export function SmartCrudItemPage<T extends IEntity<string>>(
  props: SmartCrudItemPageProps,
) {
  const { children } = props;
  const {
    config,
    mode,
    pageOptions,
    detailsOptions,
    uniqueProvider,
    onPartialChange,
    onChange,
    onValidChange,
    formRef,
    TopComponent,
    BottomComponent,
  } = useCrudItemPage<T>(props);
  const Body = useSmartComponent<SmartCrudItemPageBodyProps<T>>(
    'crud-item-page',
    SmartCrudItemPageStandard,
  );
  const standard = Body === SmartCrudItemPageStandard;

  const body = (
    <Body
      detailsOptions={detailsOptions}
      mode={mode}
      uniqueProvider={uniqueProvider}
      onPartialChange={onPartialChange}
      onChange={onChange}
      onValidChange={onValidChange}
      formRef={formRef}
    >
      {children}
    </Body>
  );

  return (
    <SmartPage options={pageOptions} className={config.className || ''}>
      <div className="text-xl py-2.5 separator">
        {TopComponent ? <TopComponent /> : null}
      </div>
      {standard ? body : null}
      <div className="dynamic-content">{!standard ? body : null}</div>
      <div className="text-xl py-2.5 separator">
        {BottomComponent ? <BottomComponent /> : null}
      </div>
    </SmartPage>
  );
}
