import {
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  TRANSLATE_DATA_ENG,
  TRANSLATE_DATA_PL,
} from '../src/lib/translations-default';

/**
 * Root providers that give every story a working TranslateService loaded with
 * the library's default dictionaries (fixed to 'pl' for deterministic
 * screenshots/audits, with 'en' registered as fallback data).
 *
 * Use ONLY inside `applicationConfig({ providers: [...] })`. Story
 * `moduleMetadata.imports` must then use the bare `TranslateModule` (never
 * `forRoot()`) so pipes resolve the root TranslateService instead of creating
 * an empty module-level instance.
 */
/**
 * Story models use field names outside the library's MODEL section — these
 * labels exist only for Storybook so `ModelLabelPipe` output is translated
 * (uppercase entries cover list-table header keys).
 */
const STORYBOOK_MODEL_LABELS = {
  pl: {
    accept: 'akceptacja',
    address: 'adres',
    active: 'aktywny',
    age: 'wiek',
    amount: 'kwota',
    bio: 'bio',
    brochure: 'broszura',
    clip: 'klip',
    color: 'kolor',
    description: 'opis',
    document: 'dokument',
    entries: 'wpisy',
    isActive: 'aktywny',
    items: 'elementy',
    label: 'etykieta',
    logo: 'logo',
    name: 'nazwa',
    note: 'notatka',
    phone: 'telefon',
    photo: 'zdjęcie',
    profile: 'profil',
    range: 'zakres',
    role: 'rola',
    startDate: 'data rozpoczęcia',
    status: 'status',
    title: 'tytuł',
    user: 'użytkownik',
    EMAIL: 'E-MAIL',
    FIRSTNAME: 'IMIĘ',
    ROLE: 'ROLA',
  },
  en: {
    accept: 'accept',
    address: 'address',
    active: 'active',
    age: 'age',
    amount: 'amount',
    bio: 'bio',
    brochure: 'brochure',
    clip: 'clip',
    color: 'color',
    description: 'description',
    document: 'document',
    entries: 'entries',
    isActive: 'active',
    items: 'items',
    label: 'label',
    logo: 'logo',
    name: 'name',
    note: 'note',
    phone: 'phone',
    photo: 'photo',
    profile: 'profile',
    range: 'range',
    role: 'role',
    startDate: 'start date',
    status: 'status',
    title: 'title',
    user: 'user',
    EMAIL: 'EMAIL',
    FIRSTNAME: 'FIRST NAME',
    ROLE: 'ROLE',
  },
};

export function provideStorybookTranslations() {
  return [
    importProvidersFrom(TranslateModule.forRoot()),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      translate.setTranslation('en', {
        ...TRANSLATE_DATA_ENG,
        MODEL: { ...TRANSLATE_DATA_ENG.MODEL, ...STORYBOOK_MODEL_LABELS.en },
      });
      translate.setTranslation('pl', {
        ...TRANSLATE_DATA_PL,
        MODEL: { ...TRANSLATE_DATA_PL.MODEL, ...STORYBOOK_MODEL_LABELS.pl },
      });
      translate.setDefaultLang('pl');
      translate.use('pl');
    }),
  ];
}
