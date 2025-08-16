import { TranslateService } from '@ngx-translate/core';

export function setDefaultTranslationsAndLang(service: TranslateService) {
  const map = {
    pl: TRANSLATE_DATA_PL,
    eng: TRANSLATE_DATA_ENG,
  };

  const DEFAULT_LANG = 'pl';

  Object.keys(map).forEach((key: string) => {
    service.setTranslation(key, map[key as 'pl' | 'eng'], true);
  });

  if (!service.currentLang) {
    const lang = service.getBrowserLang();
    service.use(lang ?? DEFAULT_LANG);
  }
}

export interface ITranslateData {
  details: string;
  admin: string;
  client: string;
  guest: string;
  add: string;
  change: string;
  confirm: string;
  cancel: string;
  delete: string;
  undo: string;
  search: string;
  page: string;
  filters: string;
  or: string;
  signInQuicklyWith: string;
  select: string;
  selected: string;
  show: string;
  download: string;
  play: string;
  writeHere: string;
  next: string;
  prev: string;
  edit: string;
  save: string;
  noResults: string;
  from: string;
  to: string;

  CALENDAR: {
    DAY_OF_WEEK: {
      Mon: string;
      Tue: string;
      Wed: string;
      Thu: string;
      Fri: string;
      Sat: string;
      Sun: string;
    };
    MONTH: {
      January: string;
      February: string;
      March: string;
      April: string;
      May: string;
      June: string;
      July: string;
      August: string;
      September: string;
      October: string;
      November: string;
      December: string;
    };
    Today: string;
    LastSevenDays: string;
    ThisMonth: string;
    Yesterday: string;
    LastThirtyDays: string;
    LastMonth: string;
  };

  OBJECT: {
    deleted: string;
    confirmDelete: string;
  };
  APP: {
    logout: string;
    signIn: string;
    logged: string;
  };
  MODEL: {
    body: string;
    buildingNumber: string;
    city: string;
    date: string;
    disabled: string;
    email: string;
    file: string;
    firstName: string;
    flatNumber: string;
    lastName: string;
    password: string;
    passwordConfirm: string;
    passwordReset: string;
    permissions: string;
    price: string;
    send: string;
    street: string;
    username: string;
    zipCode: string;
  };
  INPUT: {
    ERRORS: {
      required: string;
      requires: string;
      invalidNip: string;
      invalidFileType: string;
      invalidUnique: string;
      confirm: string;
      invalidEmailFormat: string;
      invalidPhoneNumberFormat: string;
      invalidPeselFormat: string;
      invalidMinLength: string;
      invalidMaxLength: string;
      invalidMin: string;
      invalidMax: string;
      upperLetters: string;
      lowerLetters: string;
      symbols: string;
    };
    'PASSWORD-STRENGTH': {
      poor: string;
      notGood: string;
      good: string;
    };
  };
  ERRORS: {
    invalidUsernameOrPassword: string;
    other: string;
  };
}

export const TRANSLATE_DATA_ENG: ITranslateData = {
  details: 'details',
  admin: 'administrator',
  client: 'client',
  guest: 'guest',
  add: 'add',
  change: 'change',
  confirm: 'confirm',
  cancel: 'cancel',
  delete: 'delete',
  undo: 'undo',
  search: 'search',
  page: 'page',
  filters: 'filters',
  or: 'or',
  signInQuicklyWith: 'sign in quickly with',
  selected: 'selected',
  select: 'select',
  show: 'show',
  download: 'download',
  play: 'play',
  writeHere: 'write here',
  next: 'next',
  prev: 'prev',
  edit: 'edit',
  save: 'save',
  noResults: 'no results',
  from: 'from',
  to: 'to',

  CALENDAR: {
    DAY_OF_WEEK: {
      Mon: 'Mon',
      Tue: 'Tue',
      Wed: 'Wed',
      Thu: 'Thu',
      Fri: 'Fri',
      Sat: 'Sat',
      Sun: 'Sun',
    },
    MONTH: {
      January: 'January',
      February: 'February',
      March: 'March',
      April: 'April',
      May: 'May',
      June: 'June',
      July: 'July',
      August: 'August',
      September: 'September',
      October: 'October',
      November: 'November',
      December: 'December',
    },
    Today: 'Today',
    LastSevenDays: 'Last 7 days',
    ThisMonth: 'This month',
    Yesterday: 'Yesterday',
    LastThirtyDays: 'Last 30 days',
    LastMonth: 'Last month',
  },

  OBJECT: {
    deleted: 'object deleted',
    confirmDelete: 'confirm delete object',
  },
  APP: {
    logout: 'log out',
    signIn: 'sign in',
    logged: 'logged',
  },
  MODEL: {
    body: 'body',
    buildingNumber: 'building number',
    city: 'city',
    date: 'date',
    disabled: 'disabled',
    email: 'email',
    file: 'file',
    firstName: 'first name',
    flatNumber: 'flat number',
    lastName: 'last name',
    password: 'password',
    passwordConfirm: 'confirm password',
    passwordReset: 'reset password',
    permissions: 'permissions',
    price: 'price',
    send: 'send',
    street: 'street',
    username: 'user name',
    zipCode: 'zip code',
  },
  INPUT: {
    ERRORS: {
      required: 'field is required',
      requires: 'fields are required',
      invalidNip: 'Invalid nip format',
      invalidUnique: 'Invalid unique value',
      invalidFileType: 'Invalid file type',
      confirm: 'bad confirmed',
      invalidEmailFormat: 'invalid email format',
      invalidPhoneNumberFormat: 'invalid phone number (000000000)',
      invalidPeselFormat: 'invalid pesel',
      invalidMinLength: 'min length',
      invalidMaxLength: 'max length',
      invalidMin: 'min value',
      invalidMax: 'max value',
      upperLetters: 'upper letters',
      lowerLetters: 'lower letters',
      symbols: 'string',
    },
    'PASSWORD-STRENGTH': {
      poor: 'poor',
      notGood: 'not ood',
      good: 'good',
    },
  },
  ERRORS: {
    invalidUsernameOrPassword: 'Invalid username or password',
    other: 'Error',
  },
};

export const TRANSLATE_DATA_PL: ITranslateData = {
  details: 'szczegóły',
  admin: 'administrator',
  client: 'klient',
  guest: 'gość',
  add: 'dodaj',
  change: 'zmień',
  confirm: 'potwierdź',
  cancel: 'anuluj',
  delete: 'usuń',
  undo: 'cofnij',
  search: 'wyszukaj',
  page: 'strona',
  filters: 'filtry',
  or: 'lub',
  signInQuicklyWith: 'szybko zaloguj się za pomocą',
  selected: 'wybrano',
  select: 'wybierz',
  show: 'pokaż',
  download: 'pobierz',
  play: 'włącz',
  writeHere: 'napisz tutaj',
  next: 'dalej',
  prev: 'wstecz',
  edit: 'edycja',
  save: 'zapisz',
  noResults: 'brak wyników',
  from: 'od',
  to: 'do',

  CALENDAR: {
    DAY_OF_WEEK: {
      Mon: 'Pon',
      Tue: 'Wto',
      Wed: 'Śro',
      Thu: 'Czw',
      Fri: 'Pio',
      Sat: 'Sob',
      Sun: 'Nie',
    },
    MONTH: {
      January: 'Styczeń',
      February: 'Luty',
      March: 'Marzec',
      April: 'Kwiecień',
      May: 'Maj',
      June: 'Czerwiec',
      July: 'Lipiec',
      August: 'Sierpień',
      September: 'Wrzesień',
      October: 'Październik',
      November: 'Listopad',
      December: 'Grudzień',
    },
    Today: 'Dzisiaj',
    LastSevenDays: 'Ostatnie 7 dnii',
    ThisMonth: 'Ten miesiąc',
    Yesterday: 'Wczoraj',
    LastThirtyDays: 'Ostatnie 30 dni',
    LastMonth: 'Ostatni miesiąc',
  },

  OBJECT: {
    deleted: 'obiekt został usunięty',
    confirmDelete: 'potwierdź usunięcie',
  },
  APP: {
    logout: 'wyloguj się',
    logged: 'zalogowany',
    signIn: 'zaloguj się',
  },
  MODEL: {
    body: 'treść',
    buildingNumber: 'numer budynku',
    city: 'miasto',
    date: 'data',
    disabled: 'nieaktywny',
    email: 'email',
    file: 'plik',
    firstName: 'imię',
    flatNumber: 'numer lokalu',
    lastName: 'nazwisko',
    password: 'hasło',
    passwordConfirm: 'powtórz hasło',
    passwordReset: 'Nie pamiętam hasła',
    permissions: 'uprawnienia',
    price: 'cena',
    send: 'wyślij',
    street: 'ulica',
    username: 'nazwa użytkownika',
    zipCode: 'kod pocztowy',
  },
  INPUT: {
    ERRORS: {
      required: 'to pole jest wymagane',
      requires: 'te pola są wymagane',
      invalidNip: 'niepoprawny format nip',
      invalidUnique: 'wartość jest już w systemie',
      confirm: 'źle powtórzone',
      invalidEmailFormat: 'niepoprawny adres email',
      invalidFileType: 'niepoprawny format pliku',
      invalidPhoneNumberFormat: 'niepoprawny numer telefonu (000000000)',
      invalidPeselFormat: 'niepoprawny numer pesel',
      invalidMinLength: 'minimalna długość',
      invalidMaxLength: 'maksymalna długość',
      invalidMin: 'minimalna wartość',
      invalidMax: 'maksymalna wartość',
      upperLetters: 'duże litery',
      lowerLetters: 'małe litery',
      symbols: 'znaki specjalne',
    },
    'PASSWORD-STRENGTH': {
      poor: 'bardzo słabe',
      notGood: 'słabe',
      good: 'dobre',
    },
  },
  ERRORS: {
    invalidUsernameOrPassword: 'Niepoprawna nazwa użytkownika, lub hasło',
    other: 'Wystąpił błąd',
  },
};
