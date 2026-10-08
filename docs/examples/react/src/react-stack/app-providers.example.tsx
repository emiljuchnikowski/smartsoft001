// #region usage
import type { ReactNode } from 'react';

import {
  createHistoryNavigation,
  SmartProvider,
  SMART_PRESET_COMPONENTS,
} from '@smartsoft001/react';

// Created once: the adapter listens to the browser history.
const navigation = createHistoryNavigation();

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmartProvider
      language="eng"
      navigation={navigation}
      fileServiceConfig={{ apiUrl: '/api' }}
      {...SMART_PRESET_COMPONENTS}
    >
      {children}
    </SmartProvider>
  );
}
// #endregion
