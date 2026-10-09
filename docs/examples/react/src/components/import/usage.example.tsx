// #region usage
import { useState } from 'react';

import { SmartImport } from '@smartsoft001/react';

export function ImportUsageExample() {
  const [importedFile, setImportedFile] = useState<string | null>(null);

  // Receives the picked File: read and parse it here.
  const onImport = (file: File) => setImportedFile(file.name);

  return (
    <>
      <SmartImport accept="text/csv" onSet={onImport} />
      {importedFile && <p>Imported: {importedFile}</p>}
    </>
  );
}
// #endregion
