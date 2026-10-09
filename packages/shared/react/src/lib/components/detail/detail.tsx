import { FieldType } from '@smartsoft001/models';

import { getDefaultDetailFieldComponents } from './default-field-components';
import { SmartDetailProps } from './detail.types';
import { SmartDetailText } from './text/detail-text';
import { useDetailFieldComponents } from '../../providers/hooks';
import { useModelLabel } from '../../utils/hooks';
import { SmartInfo } from '../info/info';

/**
 * The label of a field and its value, rendered by the detail component of the
 * field type, with the field's info tooltip and a skeleton while there is no
 * item yet.
 *
 * Field components are resolved from `detailFieldComponents` on `SmartProvider`
 * over the library's own; register `DETAIL_PRESET_FIELD_COMPONENTS` there for
 * the preset look. A type without a component renders `SmartDetailText`.
 */
export function SmartDetail<T>({
  options,
  type,
  className,
}: SmartDetailProps<T>) {
  const components = useDetailFieldComponents(
    getDefaultDetailFieldComponents(),
  );
  const label = useModelLabel(options?.item, options?.key ?? '', type);

  if (!options) return null;

  const Component =
    components[options.options?.type ?? FieldType.text] ?? SmartDetailText;
  const info = options.options?.info;

  return (
    <div className="smart:relative">
      {info && (
        <div className="smart:absolute smart:right-0 smart:top-0">
          <SmartInfo options={{ text: info }} />
        </div>
      )}
      <span className="smart:block smart:text-sm smart:font-medium smart:text-gray-500 smart:dark:text-gray-400">
        {label}
      </span>
      {options.item ? (
        <Component options={options} className={className} />
      ) : (
        <div className="smart:h-4 smart:w-3/4 smart:animate-pulse smart:rounded smart:bg-gray-200 smart:dark:bg-gray-700" />
      )}
    </div>
  );
}
