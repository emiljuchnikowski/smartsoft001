import { useControlBinding } from '../../../forms/hooks';
import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartSearchbarProps } from '../searchbar.types';
import { useSearchbar } from '../use-searchbar';

const CONTAINER_CLASSES = ['smart:relative', 'smart:mt-2'];

const INPUT_CLASSES = [
  'smart:block',
  'smart:w-full',
  'smart:rounded-md',
  'smart:bg-white',
  'smart:py-1.5',
  'smart:pr-10',
  'smart:pl-3',
  'smart:text-base',
  'smart:text-gray-900',
  'smart:outline-1',
  'smart:-outline-offset-1',
  'smart:outline-gray-300',
  'smart:placeholder:text-gray-400',
  'smart:focus:outline-2',
  'smart:focus:-outline-offset-2',
  'smart:focus:outline-indigo-600',
  'smart:sm:text-sm/6',
  'smart:dark:bg-white/5',
  'smart:dark:text-white',
  'smart:dark:outline-white/10',
  'smart:dark:placeholder:text-gray-500',
  'smart:dark:focus:outline-indigo-500',
];

const TOGGLE_BUTTON_CLASSES = [
  'smart:inline-flex',
  'smart:items-center',
  'smart:justify-center',
  'smart:rounded-md',
  'smart:bg-white',
  'smart:p-2',
  'smart:text-gray-500',
  'smart:shadow-xs',
  'smart:outline-1',
  'smart:-outline-offset-1',
  'smart:outline-gray-300',
  'smart:hover:bg-gray-50',
  'smart:dark:bg-white/5',
  'smart:dark:text-gray-400',
  'smart:dark:outline-white/10',
  'smart:dark:hover:bg-white/10',
];

/**
 * The default searchbar: a search input bound to the hook's `control`, hidden
 * on blur while empty. While hidden it renders a magnifier button that shows it
 * again when `options.showToggleButton` is set. `className` goes on the input.
 */
export function SmartSearchbarStandard(props: SmartSearchbarProps) {
  const { options, className } = props;
  const t = useTranslate();
  const { show, control, setShow, tryHide } = useSearchbar(props);
  const binding = useControlBinding(control);

  if (show) {
    return (
      <div className={cn(CONTAINER_CLASSES)}>
        <input
          type="search"
          className={cn(INPUT_CLASSES, className)}
          placeholder={t(options?.placeholder ?? 'search')}
          value={binding.value ?? ''}
          onChange={(event) => binding.onChange(event.target.value)}
          onBlur={() => {
            binding.onBlur();
            tryHide();
          }}
        />
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          className="smart:pointer-events-none smart:absolute smart:inset-y-0 smart:right-0 smart:mr-3 smart:size-5 smart:self-center smart:text-gray-400 smart:dark:text-gray-500"
        >
          <path
            d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 .99 1.667c-.459.134-1.033.566-1.033 1.29v.25a.75.75 0 1 0 1.5 0v-.115a2.5 2.5 0 1 0-2.518-4.153.75.75 0 1 0 1.061 1.06Z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  if (options?.showToggleButton) {
    return (
      <button
        type="button"
        className={cn(TOGGLE_BUTTON_CLASSES)}
        onClick={setShow}
      >
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          className="smart:size-5"
        >
          <path
            d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 .99 1.667c-.459.134-1.033.566-1.033 1.29v.25a.75.75 0 1 0 1.5 0v-.115a2.5 2.5 0 1 0-2.518-4.153.75.75 0 1 0 1.061 1.06Z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      </button>
    );
  }

  return null;
}
