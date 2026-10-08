const INPUT_PHONE_NUMBER_PL_PRESET_BASE = [
  'smart:py-2.5',
  'smart:sm:py-3',
  'smart:ps-12',
  'smart:pe-4',
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

const INPUT_PHONE_NUMBER_PL_PRESET_LABEL = [
  'smart:block',
  'smart:text-sm',
  'smart:font-medium',
  'smart:mb-2',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const INPUT_PHONE_NUMBER_PL_PRESET_WRAPPER = 'smart:relative';

const INPUT_PHONE_NUMBER_PL_PRESET_PREFIX = [
  'smart:absolute',
  'smart:inset-y-0',
  'smart:start-0',
  'smart:flex',
  'smart:items-center',
  'smart:pointer-events-none',
  'smart:z-20',
  'smart:ps-4',
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export function getInputPhoneNumberPlPresetClasses(cssClass: string): string {
  return cssClass
    ? `${INPUT_PHONE_NUMBER_PL_PRESET_BASE} ${cssClass}`
    : INPUT_PHONE_NUMBER_PL_PRESET_BASE;
}

export function getInputPhoneNumberPlPresetLabelClasses(): string {
  return INPUT_PHONE_NUMBER_PL_PRESET_LABEL;
}

export function getInputPhoneNumberPlPresetWrapperClasses(): string {
  return INPUT_PHONE_NUMBER_PL_PRESET_WRAPPER;
}

export function getInputPhoneNumberPlPresetPrefixClasses(): string {
  return INPUT_PHONE_NUMBER_PL_PRESET_PREFIX;
}
