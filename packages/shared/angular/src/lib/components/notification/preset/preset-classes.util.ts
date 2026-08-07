import { SmartNotificationVariant } from '../../../models';

export type SmartNotificationPresetVariant = SmartNotificationVariant;

// Card container shared by every toast variant (Preline `bg-layer` /
// `border-layer-line` / `rounded-xl` / `shadow-lg`).
const CONTAINER = [
  'smart:max-w-xs',
  'smart:w-full',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-xl',
  'smart:shadow-lg',
].join(' ');

// `text-layer-foreground font-semibold` heading used by the rich variants.
const TITLE = [
  'smart:text-sm',
  'smart:font-semibold',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
].join(' ');

// `text-sm text-layer-foreground` message paragraph (simple / condensed).
const MESSAGE = [
  'smart:text-sm',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
].join(' ');

// `mt-1 text-sm text-muted-foreground-2` secondary description.
const DESCRIPTION = [
  'smart:mt-1',
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

// Leading icon slot — renders the supplied `iconName` glyph.
const ICON = [
  'smart:shrink-0',
  'smart:inline-flex',
  'smart:mt-0.5',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

const AVATAR = [
  'smart:shrink-0',
  'smart:size-8',
  'smart:rounded-full',
  'smart:object-cover',
].join(' ');

// `text-layer-foreground opacity-50 hover:opacity-100` close button.
const CLOSE_BASE = [
  'smart:inline-flex',
  'smart:shrink-0',
  'smart:justify-center',
  'smart:items-center',
  'smart:size-5',
  'smart:rounded-lg',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:opacity-50',
  'smart:hover:opacity-100',
  'smart:focus:outline-none',
  'smart:focus:opacity-100',
].join(' ');

const CLOSE_ABSOLUTE = ['smart:absolute', 'smart:top-3', 'smart:end-3'].join(
  ' ',
);

const ACTIONS_ROW = ['smart:mt-4', 'smart:flex', 'smart:gap-x-3'].join(' ');

// `text-primary decoration-2 hover:underline` text link action.
const ACTION_LINK_PRIMARY = [
  'smart:text-blue-600',
  'smart:dark:text-blue-400',
  'smart:decoration-2',
  'smart:hover:underline',
  'smart:font-medium',
  'smart:text-sm',
  'smart:focus:outline-none',
  'smart:focus:underline',
].join(' ');

const ACTION_LINK_SECONDARY = [
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
  'smart:decoration-2',
  'smart:hover:underline',
  'smart:font-medium',
  'smart:text-sm',
  'smart:focus:outline-none',
  'smart:focus:underline',
].join(' ');

const ACTION_BUTTON_BASE = [
  'smart:py-2',
  'smart:px-3',
  'smart:inline-flex',
  'smart:items-center',
  'smart:justify-center',
  'smart:gap-x-2',
  'smart:text-sm',
  'smart:font-medium',
  'smart:rounded-lg',
  'smart:focus:outline-none',
].join(' ');

const ACTION_BUTTON_PRIMARY = [
  'smart:bg-blue-600',
  'smart:text-white',
  'smart:hover:bg-blue-700',
  'smart:dark:bg-blue-500',
  'smart:dark:hover:bg-blue-600',
].join(' ');

const ACTION_BUTTON_SECONDARY = [
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:text-gray-800',
  'smart:dark:text-white',
  'smart:hover:bg-gray-50',
  'smart:dark:hover:bg-gray-700',
].join(' ');

const BUTTON_VARIANTS: SmartNotificationVariant[] = [
  'with-buttons-below',
  'with-split-buttons',
];

export function getNotificationContainerClasses(): string {
  return CONTAINER;
}

export function getNotificationTitleClasses(): string {
  return TITLE;
}

export function getNotificationMessageClasses(): string {
  return MESSAGE;
}

export function getNotificationDescriptionClasses(): string {
  return DESCRIPTION;
}

export function getNotificationIconClasses(): string {
  return ICON;
}

export function getNotificationAvatarClasses(): string {
  return AVATAR;
}

export function getNotificationCloseClasses(absolute: boolean): string {
  return absolute ? `${CLOSE_BASE} ${CLOSE_ABSOLUTE}` : CLOSE_BASE;
}

export function getNotificationActionsRowClasses(): string {
  return ACTIONS_ROW;
}

export function getNotificationActionClasses(
  variant: SmartNotificationVariant,
  actionVariant: 'primary' | 'secondary',
): string {
  if (BUTTON_VARIANTS.includes(variant)) {
    const tone =
      actionVariant === 'secondary'
        ? ACTION_BUTTON_SECONDARY
        : ACTION_BUTTON_PRIMARY;
    const grow = variant === 'with-split-buttons' ? 'smart:grow' : '';
    return `${ACTION_BUTTON_BASE} ${tone} ${grow}`.trim();
  }

  return actionVariant === 'secondary'
    ? ACTION_LINK_SECONDARY
    : ACTION_LINK_PRIMARY;
}
