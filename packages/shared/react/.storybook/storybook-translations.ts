import type { SmartTranslations } from '../src';

/**
 * Story models use field names outside the library's MODEL section — these
 * labels exist only for Storybook so model labels are translated (uppercase
 * entries cover list-table header keys).
 */
export const STORYBOOK_MODEL_LABELS = {
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

/**
 * Merged by `SmartProvider` over the library's Polish defaults: every story
 * renders in 'pl' for deterministic screenshots.
 */
export const STORYBOOK_TRANSLATIONS: SmartTranslations = {
  MODEL: STORYBOOK_MODEL_LABELS.pl,
};
