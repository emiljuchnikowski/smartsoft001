import { cn } from '../../../../utils/class-names';
import { SmartDetails } from '../../../details/details';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetailObject } from '../use-detail-object';

/**
 * Styled object detail (preset, `DetailObjectPresetComponent`): the nested
 * details inside a card, an em dash without a nested object.
 */
export function SmartDetailObjectPreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { childOptions } = useDetailObject(props);

  if (!childOptions) {
    return (
      <span
        data-role="empty"
        className="smart:text-sm smart:text-gray-500 smart:dark:text-gray-400"
      >
        &mdash;
      </span>
    );
  }

  return (
    <div
      data-role="object"
      className={cn(
        [
          'smart:mt-2',
          'smart:block',
          'smart:rounded-lg',
          'smart:border',
          'smart:border-gray-200',
          'smart:dark:border-gray-700',
          'smart:bg-white',
          'smart:dark:bg-gray-800',
          'smart:p-3',
        ],
        className,
      )}
    >
      <SmartDetails options={childOptions} />
    </div>
  );
}
