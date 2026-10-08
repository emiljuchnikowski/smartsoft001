import { IEntity } from '@smartsoft001/domain-core';
import { SmartDetails, SmartForm } from '@smartsoft001/react';

import { SmartCrudItemPageBodyProps } from '../item-page.types';
import { useCrudItemPageBase } from '../use-crud-item-page-base';

/**
 * The default item page body: `SmartDetails` of `detailsOptions` in the
 * details mode, else `SmartForm` of the selected item for the mode, reporting
 * its changes, value and validity. `children` are not rendered.
 */
export function SmartCrudItemPageStandard<T extends IEntity<string>>(
  props: SmartCrudItemPageBodyProps<T>,
) {
  const { mode, detailsOptions, onPartialChange, onChange, onValidChange } =
    props;
  const { formOptions } = useCrudItemPageBase<T>(props);

  return (
    <>
      {mode === 'details' ? (
        detailsOptions ? (
          <SmartDetails options={detailsOptions} />
        ) : null
      ) : formOptions ? (
        <SmartForm
          options={formOptions}
          onValuePartialChange={onPartialChange}
          onValueChange={onChange}
          onValidChange={onValidChange}
        />
      ) : null}
      <br />
      <br />
    </>
  );
}
