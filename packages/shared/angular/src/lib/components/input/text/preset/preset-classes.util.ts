const INPUT_TEXT_PRESET_BASE = [
  'smart:py-2.5',
  'smart:sm:py-3',
  'smart:px-4',
  'smart:block',
  'smart:w-full',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-lg',
  'smart:sm:text-sm',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:placeholder:text-gray-500',
  'smart:dark:placeholder:text-gray-400',
  'smart:focus:border-blue-700',
  'smart:dark:focus:border-blue-600',
  'smart:focus:ring-1',
  'smart:focus:ring-blue-700',
  'smart:dark:focus:ring-blue-600',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

const INPUT_TEXT_PRESET_LABEL = [
  'smart:block',
  'smart:text-sm',
  'smart:font-medium',
  'smart:mb-2',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

export function getInputTextPresetClasses(cssClass: string): string {
  return cssClass
    ? `${INPUT_TEXT_PRESET_BASE} ${cssClass}`
    : INPUT_TEXT_PRESET_BASE;
}

export function getInputTextPresetLabelClasses(): string {
  return INPUT_TEXT_PRESET_LABEL;
}
