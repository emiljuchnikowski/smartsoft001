import { ITextareaAction, SmartTextareaVariant } from '../../../models';

export type SmartTextareaPresetVariant = SmartTextareaVariant;

type ActionVariant = NonNullable<ITextareaAction['variant']>;

const join = (...parts: string[]): string => parts.filter(Boolean).join(' ');

/** Root row: optional avatar column + body column. */
export const TEXTAREA_ROOT = 'smart:flex smart:items-start smart:gap-x-4';

/** Avatar column. */
export const TEXTAREA_AVATAR = 'smart:shrink-0';

/** Body column (label, field, bars, preview, footer). */
export const TEXTAREA_BODY = 'smart:min-w-0 smart:flex-1';

/** Field label. */
export const TEXTAREA_LABEL =
  'smart:mb-2 smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

/** Required marker inside the label. */
export const TEXTAREA_REQUIRED =
  'smart:ms-0.5 smart:text-red-600 smart:dark:text-red-400';

/** Shared text / placeholder / disabled look of every field. */
const FIELD_TEXT = join(
  'smart:block smart:w-full smart:text-base smart:sm:text-sm/6',
  'smart:text-gray-900 smart:dark:text-white',
  'smart:placeholder:text-gray-400 smart:dark:placeholder:text-gray-500',
  'smart:disabled:cursor-not-allowed smart:disabled:opacity-60',
);

/** Stand-alone outlined field (`simple`, `with-preview`). */
const FIELD_OUTLINED = join(
  FIELD_TEXT,
  'smart:rounded-lg smart:bg-white smart:px-3 smart:py-1.5 smart:dark:bg-white/5',
  'smart:outline-1 smart:-outline-offset-1 smart:outline-gray-300 smart:dark:outline-white/10',
  'smart:focus:outline-2 smart:focus:-outline-offset-2 smart:focus:outline-blue-600 smart:dark:focus:outline-blue-500',
);

/** Borderless field placed inside a framed box. */
const FIELD_BARE = join(
  FIELD_TEXT,
  'smart:resize-none smart:bg-transparent smart:px-3 smart:py-1.5 smart:focus:outline-none',
);

/** Borderless field sitting on an underline. */
const FIELD_UNDERLINE = join(
  FIELD_TEXT,
  'smart:resize-none smart:bg-transparent smart:px-0 smart:py-1.5 smart:focus:outline-none',
);

const FIELD_BY_VARIANT: Record<SmartTextareaPresetVariant, string> = {
  simple: FIELD_OUTLINED,
  'with-preview': FIELD_OUTLINED,
  'with-avatar-actions': FIELD_BARE,
  'with-pill-actions': FIELD_BARE,
  'with-underline': FIELD_UNDERLINE,
};

/** Outlined box whose focus ring follows the inner field. */
const FRAME_BOX = join(
  'smart:overflow-hidden smart:rounded-lg smart:bg-white smart:dark:bg-white/5',
  'smart:outline-1 smart:-outline-offset-1 smart:outline-gray-300 smart:dark:outline-white/10',
  'smart:focus-within:outline-2 smart:focus-within:-outline-offset-2 smart:focus-within:outline-blue-600 smart:dark:focus-within:outline-blue-500',
);

const FRAME_BY_VARIANT: Record<SmartTextareaPresetVariant, string> = {
  simple: 'smart:relative',
  'with-preview': 'smart:relative',
  'with-avatar-actions': FRAME_BOX,
  'with-pill-actions': FRAME_BOX,
  'with-underline': join(
    'smart:border-b smart:border-gray-200 smart:pb-px smart:dark:border-white/10',
    'smart:focus-within:border-b-2 smart:focus-within:border-blue-600 smart:focus-within:pb-0 smart:dark:focus-within:border-blue-500',
  ),
};

/** Variants that keep the toolbar/actions bar inside the framed box. */
const BAR_INSIDE: ReadonlySet<SmartTextareaPresetVariant> = new Set([
  'with-avatar-actions',
  'with-pill-actions',
]);

const BAR_BASE =
  'smart:flex smart:items-center smart:justify-between smart:gap-x-3';

const BAR_BY_VARIANT: Record<SmartTextareaPresetVariant, string> = {
  simple: join(BAR_BASE, 'smart:mt-2'),
  'with-preview': join(BAR_BASE, 'smart:mt-2'),
  'with-underline': join(BAR_BASE, 'smart:pt-2'),
  'with-avatar-actions': join(BAR_BASE, 'smart:py-2 smart:ps-3 smart:pe-2'),
  'with-pill-actions': join(
    BAR_BASE,
    'smart:border-t smart:border-gray-200 smart:px-2 smart:py-2 smart:dark:border-white/10',
  ),
};

/** Toolbar slot (left side of the bar). */
export const TEXTAREA_TOOLBAR =
  'smart:flex smart:items-center smart:gap-x-1 smart:text-gray-500 smart:dark:text-gray-400';

/** Action buttons group (right side of the bar). */
export const TEXTAREA_ACTIONS =
  'smart:ms-auto smart:flex smart:shrink-0 smart:items-center smart:gap-x-2';

const ACTION_BASE = join(
  'smart:inline-flex smart:items-center smart:gap-x-1.5 smart:px-3 smart:py-2 smart:text-sm smart:font-semibold',
  'smart:focus-visible:outline-2 smart:focus-visible:outline-offset-2 smart:focus-visible:outline-blue-600 smart:dark:focus-visible:outline-blue-500',
  'smart:disabled:cursor-not-allowed smart:disabled:opacity-50',
);

const ACTION_BY_VARIANT: Record<ActionVariant, string> = {
  primary: join(
    'smart:bg-blue-600 smart:text-white smart:shadow-xs smart:hover:bg-blue-500',
    'smart:dark:bg-blue-500 smart:dark:shadow-none smart:dark:hover:bg-blue-400',
  ),
  secondary: join(
    'smart:bg-white smart:text-gray-900 smart:shadow-xs smart:ring-1 smart:ring-inset smart:ring-gray-300 smart:hover:bg-gray-50',
    'smart:dark:bg-white/10 smart:dark:text-white smart:dark:shadow-none smart:dark:ring-white/10 smart:dark:hover:bg-white/20',
  ),
  ghost: join(
    'smart:text-gray-700 smart:hover:bg-gray-100',
    'smart:dark:text-gray-300 smart:dark:hover:bg-white/10',
  ),
};

/** Tabs row of the `with-preview` variant. */
export const TEXTAREA_TABS =
  'smart:mb-2 smart:flex smart:items-center smart:gap-x-2';

const TAB_BASE =
  'smart:rounded-md smart:px-3 smart:py-1.5 smart:text-sm smart:font-medium';

/** Preview pane replacing the field in `with-preview` (preview tab). */
export const TEXTAREA_PREVIEW_PANE = join(
  'smart:min-h-24 smart:rounded-lg smart:px-3 smart:py-2 smart:text-sm smart:text-gray-900 smart:dark:text-white',
  'smart:outline-1 smart:-outline-offset-1 smart:outline-gray-300 smart:dark:outline-white/10',
);

/** Preview block rendered below the field in the other variants. */
export const TEXTAREA_PREVIEW_BELOW = join(
  'smart:mt-3 smart:rounded-lg smart:border smart:border-gray-200 smart:bg-gray-50 smart:px-3 smart:py-2',
  'smart:text-sm smart:text-gray-900 smart:dark:border-white/10 smart:dark:bg-white/5 smart:dark:text-white',
);

/** Character counter (shown when `maxLength` is set). */
export const TEXTAREA_COUNTER =
  'smart:mt-1 smart:text-end smart:text-xs smart:text-gray-500 smart:dark:text-gray-400';

/** Footer slot. */
export const TEXTAREA_FOOTER =
  'smart:mt-2 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';

export function textareaFieldClasses(
  variant: SmartTextareaPresetVariant,
): string {
  return FIELD_BY_VARIANT[variant];
}

export function textareaFrameClasses(
  variant: SmartTextareaPresetVariant,
): string {
  return FRAME_BY_VARIANT[variant];
}

export function textareaBarClasses(
  variant: SmartTextareaPresetVariant,
): string {
  return BAR_BY_VARIANT[variant];
}

export function textareaBarInside(
  variant: SmartTextareaPresetVariant,
): boolean {
  return BAR_INSIDE.has(variant);
}

export function textareaActionClasses(
  actionVariant: ITextareaAction['variant'],
  variant: SmartTextareaPresetVariant,
): string {
  const shape =
    variant === 'with-pill-actions' ? 'smart:rounded-full' : 'smart:rounded-md';
  return join(
    ACTION_BASE,
    shape,
    ACTION_BY_VARIANT[actionVariant ?? 'secondary'],
  );
}

export function textareaTabClasses(selected: boolean): string {
  return join(
    TAB_BASE,
    selected
      ? 'smart:bg-gray-100 smart:text-gray-900 smart:dark:bg-white/10 smart:dark:text-white'
      : 'smart:text-gray-500 smart:hover:bg-gray-100 smart:hover:text-gray-900 smart:dark:text-gray-400 smart:dark:hover:bg-white/5 smart:dark:hover:text-white',
  );
}
