import { Fragment } from 'react';

import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetailEnum } from './use-detail-enum';

/**
 * `<smart-detail-enum>` (`DetailEnumComponent`): the translated value(s),
 * separated by commas.
 */
export function SmartDetailEnum<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const { item, key, values } = useDetailEnum(props);

  if (!item || !key) return null;

  return (
    <p
      className={cn(
        ['smart:text-sm', 'smart:text-gray-900', 'smart:dark:text-gray-100'],
        className,
      )}
    >
      {values.map((val, index) => (
        <Fragment key={val}>
          {index > 0 && <>,&nbsp;</>}
          {t(val)}
        </Fragment>
      ))}
    </p>
  );
}
