import { cn } from '../../../../utils/class-names';
import { SmartDetails } from '../../../details/details';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetailArray } from '../use-detail-array';

/**
 * Styled array detail (preset): a card per element, an em dash without
 * elements.
 */
export function SmartDetailArrayPreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { childOptions } = useDetailArray(props);

  return (
    <div
      data-role="array"
      className={cn(
        ['smart:mt-2', 'smart:block', 'smart:space-y-2'],
        className,
      )}
    >
      {childOptions.length ? (
        childOptions.map((opt, index) => (
          <div
            key={index}
            data-role="item"
            className="smart:block smart:rounded-lg smart:border smart:border-gray-200 smart:bg-white smart:p-3 smart:dark:border-gray-700 smart:dark:bg-gray-800"
          >
            <SmartDetails options={opt} />
          </div>
        ))
      ) : (
        <span
          data-role="empty"
          className="smart:text-sm smart:text-gray-400 smart:dark:text-gray-500"
        >
          —
        </span>
      )}
    </div>
  );
}
