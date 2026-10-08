import { IEntity } from '@smartsoft001/domain-core';
import { SmartButton } from '@smartsoft001/react';

import { SmartCrudExportProps } from './export.types';
import { useCrudExport } from './use-crud-export';

/**
 * `<smart-crud-export>`: the CSV / XLSX buttons exporting the list of the
 * CRUD feature with its current filter (the Angular `ExportComponent`).
 */
export function SmartCrudExport<T extends IEntity<string>>(
  props: SmartCrudExportProps,
) {
  const { elementRef, buttonExportCsvOptions, buttonExportXlsxOptions } =
    useCrudExport<T>(props);

  return (
    <div ref={elementRef} className="smart:p-5">
      <p className="smart:my-2.5 smart:mx-0">
        <SmartButton
          options={buttonExportCsvOptions}
          className="smart:w-full smart:block"
        >
          CSV
        </SmartButton>
      </p>
      <p>
        <SmartButton
          options={buttonExportXlsxOptions}
          className="smart:w-full smart:block"
        >
          XLSX
        </SmartButton>
      </p>
    </div>
  );
}
