import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { createHistoryNavigation } from './navigation';
import {
  createSmartContextValue,
  createSmartServices,
  createSmartTranslate,
  SmartConfig,
  SmartContext,
} from './smart-context';
import { SmartOverlays } from '../components/overlays/overlays';
import { SmartTranslateFn } from '../i18n/translate';

export interface SmartProviderProps extends SmartConfig {
  children?: ReactNode;
  /**
   * Rendered after `children`: the hosts of the toasts, alerts and modals the
   * services open. `<SmartOverlays />` from this package by default; pass
   * `null` to render them yourself.
   */
  overlays?: ReactNode;
}

/**
 * The root of an application built with the library: it supplies the
 * translations, the navigation adapter, the services, the component overrides
 * and the model providers to every component below it.
 *
 * The services are created once. Pass memoised objects for `components`,
 * `translations` and the providers, or the context changes on every render.
 */
export function SmartProvider(props: SmartProviderProps) {
  const { children, overlays = <SmartOverlays />, ...config } = props;
  const translate = useMemo(
    () => createSmartTranslate(config),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.translate, config.translations, config.language],
  );
  const translateRef = useRef<SmartTranslateFn>(translate);

  useEffect(() => {
    translateRef.current = translate;
  }, [translate]);

  const [services] = useState(() =>
    createSmartServices(config, () => translateRef.current),
  );
  const [defaultNavigation] = useState(() =>
    config.navigation ? null : createHistoryNavigation(),
  );

  const value = useMemo(
    () =>
      createSmartContextValue(
        { ...config, translate },
        services,
        defaultNavigation ?? undefined,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      services,
      translate,
      defaultNavigation,
      config.language,
      config.navigation,
      config.components,
      config.inputFieldComponents,
      config.detailFieldComponents,
      config.listModeComponents,
      config.modelLabelProvider,
      config.modelPossibilitiesProvider,
      config.modelValidatorsProvider,
      config.modelExportProvider,
      config.modelImportProvider,
      config.appProvider,
    ],
  );

  return (
    <SmartContext.Provider value={value}>
      {children}
      {overlays}
    </SmartContext.Provider>
  );
}
