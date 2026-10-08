import { IEntity } from '@smartsoft001/domain-core';

import { cn } from '../../../utils/class-names';
import { SmartDetail } from '../../detail/detail';
import { SmartDetailsProps } from '../details.types';
import { useDetails } from '../use-details';

/**
 * The default details rendering (`<smart-details-standard>`): a description
 * list with a `<SmartDetail>` per field, between the `componentFactories.top`
 * and `componentFactories.bottom` components.
 */
export function SmartDetailsStandard<T extends IEntity<string>>(
  props: SmartDetailsProps<T>,
) {
  const { className } = props;
  const { fields, type, item, loading, cellPipe, componentFactories } =
    useDetails(props);
  const Top = componentFactories?.top;
  const Bottom = componentFactories?.bottom;

  return (
    <div
      className={cn(
        [
          'smart:border-t',
          'smart:border-gray-100',
          'smart:dark:border-white/10',
        ],
        className,
      )}
    >
      <div>{Top && <Top />}</div>

      <dl className="smart:divide-y smart:divide-gray-100 smart:dark:divide-white/10">
        {fields?.map((field) => (
          <div
            key={field.key}
            className="smart:px-4 smart:py-4 smart:sm:grid smart:sm:grid-cols-3 smart:sm:gap-4"
          >
            <SmartDetail
              type={type}
              options={{
                key: field.key,
                options: field.options,
                cellPipe: cellPipe ?? undefined,
                item,
                loading: loading ?? undefined,
              }}
            />
          </div>
        ))}
      </dl>

      <div>{Bottom && <Bottom />}</div>
    </div>
  );
}
