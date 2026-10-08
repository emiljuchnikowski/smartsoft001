import { SmartDetailFieldProps } from './detail.types';
import { ICellPipe } from '../../models';
import { useTranslate } from '../../providers/hooks';
import { getListCell } from '../../utils/model';

/**
 * What every detail field shares (the Angular `DetailBaseComponent`): the
 * item, the key of the field and its value, unwrapped from `options`.
 */
export function useDetail<T>({ options }: SmartDetailFieldProps<T>) {
  const item = options?.item ?? null;
  const key = options?.key ?? null;
  const value = item && key ? (item as Record<string, any>)[key] : undefined;

  return {
    item,
    key,
    value,
    cellPipe: options?.cellPipe ?? null,
    fieldOptions: options?.options ?? null,
    loading: options?.loading,
  };
}

/**
 * The value a text-like detail renders: `item | smartListCell: key : cellPipe`,
 * the cell pipe's result (or the raw value), translated when it is a string.
 */
export function useDetailCellValue<T>(props: SmartDetailFieldProps<T>): any {
  const translate = useTranslate();
  const { item, key, cellPipe } = useDetail(props);

  if (!item || !key) return undefined;

  return getListCell(
    item as Record<string, any>,
    key,
    cellPipe as ICellPipe<Record<string, any>> | null,
    undefined,
    translate,
  )?.value;
}
