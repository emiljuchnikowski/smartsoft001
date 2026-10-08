import { useInputArray } from './use-input-array';
import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartButton } from '../../button/button';
import { SmartForm } from '../../form/form';
import { SmartInputFieldProps } from '../input.types';

/**
 * `<smart-input-array>`: the label of an `array` field, a nested `SmartForm`
 * per item and an add button (hidden for `possibilities.static`). Items are
 * reordered by dragging one onto another (native drag and drop, where the
 * Angular field used the CDK). Like the Angular template, this variant has no
 * remove button; `SmartInputArrayPreset` has one.
 */
export function SmartInputArray<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const {
    control,
    label,
    required,
    items,
    add,
    isStatic,
    getItemKey,
    getItemDragProps,
  } = useInputArray(props);

  if (!control) return null;

  return (
    <>
      <label className="smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white">
        {label}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn('smart:mt-2 smart:space-y-2', className)}>
        {items.map((item, index) => (
          <div
            key={getItemKey(item.control)}
            className="smart:rounded smart:border smart:border-gray-200 smart:p-2 smart:dark:border-gray-700"
            {...getItemDragProps(index)}
          >
            <SmartForm options={item} />
          </div>
        ))}
        {!isStatic && (
          <SmartButton options={{ variant: 'primary', click: add }}>
            {t('add')}
          </SmartButton>
        )}
      </div>
    </>
  );
}
