// #region usage
import 'reflect-metadata';
import '@smartsoft001/react/styles.css';
import '@smartsoft001/crud-shell-react/styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import {
  createHistoryNavigation,
  SmartButton,
  SmartProvider,
  useNavigation,
  useTranslate,
} from '@smartsoft001/react';

// Created once: the adapter follows the browser history. An application with
// a router passes an adapter over that router instead.
const navigation = createHistoryNavigation();

// Deep-merged over the library's own dictionary.
const translations = { openNotes: 'Open notes' };

function Home() {
  const t = useTranslate();
  const { navigate } = useNavigation();

  return (
    <SmartButton options={{ click: () => navigate('/notes') }}>
      {t('openNotes')}
    </SmartButton>
  );
}

export function mount(element: HTMLElement) {
  const root = createRoot(element);

  root.render(
    <StrictMode>
      <SmartProvider
        language="eng"
        translations={translations}
        navigation={navigation}
      >
        <Home />
      </SmartProvider>
    </StrictMode>,
  );

  return root;
}
// #endregion
