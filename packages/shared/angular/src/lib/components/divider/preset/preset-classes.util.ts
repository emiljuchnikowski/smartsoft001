import { SmartDividerVariant } from '../../../models';

export type SmartDividerPresetVariant = SmartDividerVariant;
export type SmartDividerPresetPosition = 'left' | 'center' | 'right';

// Plain horizontal rule (Preline "Example" / "Height" dividers).
export const DIVIDER_PLAIN_HR = [
  'smart:my-0',
  'smart:border-t',
  'smart:border-gray-200',
  'smart:dark:border-neutral-700',
].join(' ');

// Shared flex shell for content-bearing dividers (label / icon / title / button).
const CONTENT_BASE = [
  'smart:py-3',
  'smart:flex',
  'smart:items-center',
  'smart:gap-x-2',
].join(' ');

// Default inline text styling (with-label / with-icon / with-button).
const TEXT_DEFAULT =
  'smart:text-sm smart:text-gray-800 smart:dark:text-neutral-200';

// Preline "Or" treatment for title dividers: uppercase, muted, smaller.
// gray-600 rather than Preline's gray-400: at this size the lighter shade is
// 2.6:1 on a white surface and fails WCAG AA.
const TEXT_TITLE = [
  'smart:text-xs',
  'smart:uppercase',
  'smart:font-medium',
  'smart:text-gray-600',
  'smart:dark:text-neutral-400',
].join(' ');

// before/after pseudo-element rules drawn through the divider content.
const LINE_BEFORE = [
  'smart:before:flex-1',
  'smart:before:border-t',
  'smart:before:border-gray-200',
  'smart:before:me-6',
  'smart:dark:before:border-neutral-600',
].join(' ');

const LINE_AFTER = [
  'smart:after:flex-1',
  'smart:after:border-t',
  'smart:after:border-gray-200',
  'smart:after:ms-6',
  'smart:dark:after:border-neutral-600',
].join(' ');

const POSITION_LINES: Record<SmartDividerPresetPosition, string> = {
  left: LINE_AFTER,
  center: `${LINE_BEFORE} ${LINE_AFTER}`,
  right: LINE_BEFORE,
};

// Standalone line filler used by the toolbar layout (between content + action).
export const DIVIDER_TOOLBAR_LINE = [
  'smart:flex-1',
  'smart:border-t',
  'smart:border-gray-200',
  'smart:dark:border-neutral-600',
].join(' ');

// Container for the toolbar variant: content + line + action button in a row.
export const DIVIDER_TOOLBAR_CONTAINER = [
  'smart:py-3',
  'smart:flex',
  'smart:items-center',
  'smart:gap-x-4',
].join(' ');

// Icon slot (Preline shrink-0 size-4 icon sizing).
export const DIVIDER_ICON_CLASSES = 'smart:shrink-0 smart:size-4';

// Action button styled after Preline's outline button.
export const DIVIDER_ACTION_BUTTON = [
  'smart:py-1.5',
  'smart:px-3',
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-1.5',
  'smart:text-sm',
  'smart:font-medium',
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-200',
  'smart:bg-white',
  'smart:text-gray-800',
  'smart:shadow-2xs',
  'smart:hover:bg-gray-50',
  'smart:focus:outline-none',
  'smart:focus:bg-gray-50',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
  'smart:dark:bg-neutral-900',
  'smart:dark:border-neutral-700',
  'smart:dark:text-neutral-300',
  'smart:dark:hover:bg-neutral-800',
  'smart:dark:focus:bg-neutral-800',
].join(' ');

function getTextClasses(variant: SmartDividerPresetVariant): string {
  return variant === 'with-title' ? TEXT_TITLE : TEXT_DEFAULT;
}

/**
 * Classes for the flex container that wraps centered divider content and draws
 * the connecting line(s) on the side(s) dictated by `position`.
 */
export function getDividerContainerClasses(
  variant: SmartDividerPresetVariant,
  position: SmartDividerPresetPosition,
): string {
  return [CONTENT_BASE, getTextClasses(variant), POSITION_LINES[position]].join(
    ' ',
  );
}

export function getDividerIconClasses(): string {
  return DIVIDER_ICON_CLASSES;
}

export function getDividerActionClasses(): string {
  return DIVIDER_ACTION_BUTTON;
}

export function getDividerToolbarClasses(): string {
  return DIVIDER_TOOLBAR_CONTAINER;
}

export function getDividerToolbarLineClasses(): string {
  return DIVIDER_TOOLBAR_LINE;
}

export function getDividerPlainClasses(): string {
  return DIVIDER_PLAIN_HR;
}
