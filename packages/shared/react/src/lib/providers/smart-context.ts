import { createContext, useContext } from 'react';
import type { ComponentType } from 'react';

import { FieldTypeDef } from '@smartsoft001/models';

import { IAppProvider } from './interfaces';
import { IModelExportProvider } from './model-export.provider';
import { IModelImportProvider } from './model-import.provider';
import { IModelLabelProvider } from './model-label.provider';
import { IModelPossibilitiesProvider } from './model-possibilities.provider';
import { IModelValidatorsProvider } from './model-validators.provider';
import { createHistoryNavigation, ISmartNavigation } from './navigation';
import { FormFactory } from '../factories/form/form.factory';
import {
  createTranslator,
  mergeTranslations,
  SMART_DEFAULT_TRANSLATIONS,
  SmartTranslateFn,
  SmartTranslations,
} from '../i18n/translate';
import { DynamicComponentType, ListMode } from '../models/interfaces';
import { AlertService } from '../services/alert/alert.service';
import { AppService } from '../services/app/app.service';
import { AuthService } from '../services/auth/auth.service';
import { DetailsService } from '../services/details/details.service';
import { ErrorService } from '../services/error/error.service';
import { FileService, IFileServiceConfig } from '../services/file/file.service';
import {
  createAuthInterceptor,
  SmartHttpClient,
} from '../services/http/http.client';
import { MenuService } from '../services/menu/menu.service';
import { ModalService } from '../services/modal/modal.service';
import { StorageService } from '../services/storage/storage.service';
import { StyleService } from '../services/style/style.service';
import { ToastService } from '../services/toast/toast.service';

/**
 * The name a component is registered under to replace the default rendering
 * of a wrapper: the `DynamicComponentType`s of the Angular library
 * (`'button'`, `'list'`, ...) and any other key a wrapper documents.
 */
export type SmartComponentKey = DynamicComponentType | (string & {});

/**
 * Replacement implementations, by key. This is what the Angular
 * `*_STANDARD_COMPONENT_TOKEN` injection tokens did: register
 * `{ button: ButtonPreset }` and every `<Button>` renders the preset.
 */
export type SmartComponentOverrides = Partial<
  Record<SmartComponentKey, ComponentType<any>>
>;

export interface SmartServices {
  storageService: StorageService;
  authService: AuthService;
  http: SmartHttpClient;
  fileService: FileService | null;
  detailsService: DetailsService;
  appService: AppService;
  menuService: MenuService;
  toastService: ToastService;
  alertService: AlertService;
  modalService: ModalService;
  errorService: ErrorService;
  styleService: StyleService;
  formFactory: FormFactory;
}

export interface SmartConfig {
  /** `pl` (default) or `eng`, the languages the library ships text for. */
  language?: string;
  /** The application's dictionary, merged over the library's defaults. */
  translations?: SmartTranslations;
  /** Replaces the dictionary lookup, e.g. with i18next's `t`. */
  translate?: SmartTranslateFn;
  navigation?: ISmartNavigation;

  storageService?: StorageService;
  authService?: AuthService;
  http?: SmartHttpClient;
  /** Adds the access token to the default HTTP client's requests (default `true`). */
  authInterceptor?: boolean;
  /** Where attachments live; enables the file inputs. */
  fileServiceConfig?: IFileServiceConfig;
  fileService?: FileService;
  toastService?: ToastService;
  alertService?: AlertService;
  modalService?: ModalService;
  menuService?: MenuService;
  appService?: AppService;

  components?: SmartComponentOverrides;
  /** Input implementations by field type (`INPUT_FIELD_COMPONENTS_TOKEN`). */
  inputFieldComponents?: Partial<Record<FieldTypeDef, ComponentType<any>>>;
  /** Detail implementations by field type (`DETAIL_FIELD_COMPONENTS_TOKEN`). */
  detailFieldComponents?: Partial<Record<FieldTypeDef, ComponentType<any>>>;
  /** List implementations by mode (`LIST_MODE_COMPONENTS_TOKEN`). */
  listModeComponents?: Partial<Record<ListMode, ComponentType<any>>>;

  modelLabelProvider?: IModelLabelProvider | null;
  modelPossibilitiesProvider?: IModelPossibilitiesProvider | null;
  modelValidatorsProvider?: IModelValidatorsProvider | null;
  modelExportProvider?: IModelExportProvider | null;
  modelImportProvider?: IModelImportProvider | null;
  appProvider?: IAppProvider | null;
}

export interface SmartContextValue extends SmartServices {
  language: string;
  translate: SmartTranslateFn;
  navigation: ISmartNavigation;
  components: SmartComponentOverrides;
  inputFieldComponents: Partial<Record<FieldTypeDef, ComponentType<any>>>;
  detailFieldComponents: Partial<Record<FieldTypeDef, ComponentType<any>>>;
  listModeComponents: Partial<Record<ListMode, ComponentType<any>>>;
  modelLabelProvider: IModelLabelProvider | null;
  modelPossibilitiesProvider: IModelPossibilitiesProvider | null;
  modelValidatorsProvider: IModelValidatorsProvider | null;
  modelExportProvider: IModelExportProvider | null;
  modelImportProvider: IModelImportProvider | null;
  appProvider: IAppProvider | null;
}

export const DEFAULT_LANGUAGE = 'pl';

/** The translate function a configuration describes. */
export function createSmartTranslate(config: SmartConfig): SmartTranslateFn {
  if (config.translate) return config.translate;

  const language = config.language ?? DEFAULT_LANGUAGE;

  return createTranslator(
    mergeTranslations(
      SMART_DEFAULT_TRANSLATIONS[language] as unknown as SmartTranslations,
      config.translations,
    ),
  );
}

/**
 * Creates the services a configuration describes. They hold state (the
 * toast queue, the menu, the app buttons), so `SmartProvider` creates them
 * once and keeps them for its lifetime.
 */
export function createSmartServices(
  config: SmartConfig,
  getTranslate: () => SmartTranslateFn,
): SmartServices {
  const storageService = config.storageService ?? new StorageService();
  const authService = config.authService ?? new AuthService(storageService);
  const http =
    config.http ??
    new SmartHttpClient({
      interceptors:
        config.authInterceptor === false
          ? []
          : [createAuthInterceptor(() => authService.getAccessToken())],
    });
  const toastService = config.toastService ?? new ToastService();
  const detailsService = new DetailsService();
  // The services translate through the provider's current function, so a
  // language switch reaches them without recreating them.
  const translateRef = (key: string) => getTranslate()(key);

  return {
    storageService,
    authService,
    http,
    fileService:
      config.fileService ??
      (config.fileServiceConfig
        ? new FileService(config.fileServiceConfig, http, () =>
            authService.getAccessToken(),
          )
        : null),
    detailsService,
    appService: config.appService ?? new AppService(translateRef),
    menuService: config.menuService ?? new MenuService(),
    toastService,
    alertService: config.alertService ?? new AlertService(),
    modalService: config.modalService ?? new ModalService(),
    errorService: new ErrorService(toastService, translateRef),
    styleService: new StyleService(),
    formFactory: new FormFactory({
      authService,
      detailsService,
      validatorsProvider: config.modelValidatorsProvider ?? null,
    }),
  };
}

/** The full context value for a configuration and a set of services. */
export function createSmartContextValue(
  config: SmartConfig = {},
  services?: SmartServices,
  navigation?: ISmartNavigation,
): SmartContextValue {
  const translate = createSmartTranslate(config);

  return {
    ...(services ?? createSmartServices(config, () => translate)),
    language: config.language ?? DEFAULT_LANGUAGE,
    translate,
    navigation: config.navigation ?? navigation ?? createHistoryNavigation(),
    components: config.components ?? {},
    inputFieldComponents: config.inputFieldComponents ?? {},
    detailFieldComponents: config.detailFieldComponents ?? {},
    listModeComponents: config.listModeComponents ?? {},
    modelLabelProvider: config.modelLabelProvider ?? null,
    modelPossibilitiesProvider: config.modelPossibilitiesProvider ?? null,
    modelValidatorsProvider: config.modelValidatorsProvider ?? null,
    modelExportProvider: config.modelExportProvider ?? null,
    modelImportProvider: config.modelImportProvider ?? null,
    appProvider: config.appProvider ?? null,
  };
}

export const SmartContext = createContext<SmartContextValue | null>(null);

let fallbackContext: SmartContextValue | null = null;

/**
 * The library's context. Outside a `SmartProvider` the components still work,
 * against a default configuration created on first use.
 */
export function useSmart(): SmartContextValue {
  const context = useContext(SmartContext);

  if (context) return context;

  fallbackContext ??= createSmartContextValue();

  return fallbackContext;
}
