import {
  ITranslateData,
  TRANSLATE_DATA_ENG,
  TRANSLATE_DATA_PL,
} from './translations-default';

/**
 * Translates `key`, with `{{name}}` placeholders filled from `params`. Like
 * ngx-translate's `instant`, it returns the key itself when there is no
 * translation, which is what the label helpers rely on to detect a miss.
 */
export type SmartTranslateFn = (
  key: string,
  params?: Record<string, unknown>,
) => string;

export type SmartTranslations = Record<string, unknown>;

/** The dictionaries the library ships, by language. */
export const SMART_DEFAULT_TRANSLATIONS: Record<string, ITranslateData> = {
  pl: TRANSLATE_DATA_PL,
  eng: TRANSLATE_DATA_ENG,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** Deep-merges dictionaries; later ones win. */
export function mergeTranslations(
  ...dictionaries: Array<SmartTranslations | null | undefined>
): SmartTranslations {
  const result: SmartTranslations = {};

  for (const dictionary of dictionaries) {
    if (!dictionary) continue;

    for (const [key, value] of Object.entries(dictionary)) {
      const current = result[key];

      result[key] =
        isPlainObject(current) && isPlainObject(value)
          ? mergeTranslations(current, value)
          : value;
    }
  }

  return result;
}

function lookup(dictionary: SmartTranslations, key: string): unknown {
  if (key in dictionary) return dictionary[key];

  let current: unknown = dictionary;

  for (const segment of key.split('.')) {
    if (!isPlainObject(current) || !(segment in current)) return undefined;
    current = current[segment];
  }

  return current;
}

/** A translator over a nested dictionary, ngx-translate style. */
export function createTranslator(
  dictionary: SmartTranslations,
): SmartTranslateFn {
  return (key, params) => {
    if (!key) return key;

    const value = lookup(dictionary, key);

    if (typeof value !== 'string') return key;
    if (!params) return value;

    return value.replace(/{{\s*([\w.]+)\s*}}/g, (match, name: string) => {
      const param = lookup(params as SmartTranslations, name);

      return param === undefined || param === null ? match : String(param);
    });
  };
}
