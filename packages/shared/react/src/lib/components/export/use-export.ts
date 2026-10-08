import { useCallback } from 'react';

import { SmartExportProps } from './export.types';

/**
 * The Angular `ExportBaseComponent`: `onClick` hands `value` and `fileName`
 * to `handler`, and does nothing while there is no value.
 */
export function useExport({
  value,
  fileName,
  handler,
}: Pick<SmartExportProps, 'value' | 'fileName' | 'handler'>) {
  const onClick = useCallback(async (): Promise<void> => {
    if (value) {
      handler(value, fileName);
      return;
    }
  }, [value, fileName, handler]);

  return { onClick };
}
