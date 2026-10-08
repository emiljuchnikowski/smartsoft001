import { useMemo } from 'react';
import type { ComponentType } from 'react';

import { FieldTypeDef } from '@smartsoft001/models';

import { ISmartNavigation } from './navigation';
import { SmartComponentKey, useSmart } from './smart-context';
import { SmartTranslateFn } from '../i18n/translate';
import { ListMode } from '../models/interfaces';

/** The provider's translate function (`'cancel' | translate` in Angular). */
export function useTranslate(): SmartTranslateFn {
  return useSmart().translate;
}

export function useNavigation(): ISmartNavigation {
  return useSmart().navigation;
}

/**
 * The component registered under `key`, or `fallback`. Wrappers call this to
 * let an application swap their default implementation.
 */
export function useSmartComponent<P>(
  key: SmartComponentKey,
  fallback: ComponentType<P>,
): ComponentType<P> {
  const registered = useSmart().components[key] as ComponentType<P> | undefined;

  return registered ?? fallback;
}

/** The input implementations registered by field type, over `defaults`. */
export function useInputFieldComponents(
  defaults: Partial<Record<FieldTypeDef, ComponentType<any>>>,
): Partial<Record<FieldTypeDef, ComponentType<any>>> {
  const registered = useSmart().inputFieldComponents;

  return useMemo(
    () => ({ ...defaults, ...registered }),
    [defaults, registered],
  );
}

/** The detail implementations registered by field type, over `defaults`. */
export function useDetailFieldComponents(
  defaults: Partial<Record<FieldTypeDef, ComponentType<any>>>,
): Partial<Record<FieldTypeDef, ComponentType<any>>> {
  const registered = useSmart().detailFieldComponents;

  return useMemo(
    () => ({ ...defaults, ...registered }),
    [defaults, registered],
  );
}

/** The list implementations registered by mode, over `defaults`. */
export function useListModeComponents(
  defaults: Partial<Record<ListMode, ComponentType<any>>>,
): Partial<Record<ListMode, ComponentType<any>>> {
  const registered = useSmart().listModeComponents;

  return useMemo(
    () => ({ ...defaults, ...registered }),
    [defaults, registered],
  );
}

export const useAuthService = () => useSmart().authService;
export const useStorageService = () => useSmart().storageService;
export const useHttpClient = () => useSmart().http;
export const useFileService = () => useSmart().fileService;
export const useDetailsService = () => useSmart().detailsService;
export const useAppService = () => useSmart().appService;
export const useMenuService = () => useSmart().menuService;
export const useToastService = () => useSmart().toastService;
export const useAlertService = () => useSmart().alertService;
export const useModalService = () => useSmart().modalService;
export const useErrorService = () => useSmart().errorService;
export const useStyleService = () => useSmart().styleService;
export const useFormFactory = () => useSmart().formFactory;
