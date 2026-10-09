import { FieldType, getModelFieldOptions } from '@smartsoft001/models';

/**
 * Whether the column `key` is an image field of the model `type`.
 */
export function isListImageKey(type: any, key: string): boolean {
  if (!type) return false;

  const options = getModelFieldOptions(new type(), key);

  return options?.type === FieldType.image;
}

/**
 * The first non-image column, rendered as the card title by the mobile and
 * masonry-grid presets.
 */
export function getListTitleKey(
  type: any,
  keys: Array<string> | null,
): string | null {
  if (!keys) return null;

  return keys.find((key) => !isListImageKey(type, key)) ?? null;
}
