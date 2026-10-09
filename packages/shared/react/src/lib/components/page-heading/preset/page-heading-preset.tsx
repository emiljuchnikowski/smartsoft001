import { useState } from 'react';

import { cn } from '../../../utils/class-names';
import { SmartPageHeadingProps } from '../page-heading.types';
import {
  getPageHeadingBarClasses,
  getPageHeadingHeaderClasses,
  PageHeadingPresetLayout,
} from './preset-classes';

const TITLE_CLASSES =
  'smart:truncate smart:text-lg smart:font-semibold smart:text-gray-900 smart:dark:text-white';
const SUBTITLE_CLASSES =
  'smart:truncate smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';
const HAMBURGER_CLASSES =
  'smart:block smart:md:hidden smart:rounded-sm smart:bg-gray-100 smart:p-2.5 smart:text-gray-600 smart:transition smart:hover:text-gray-600/75 smart:dark:bg-gray-800 smart:dark:text-white smart:dark:hover:text-white/75';

/**
 * HyperUI-styled page heading variation (preset). Register it as
 * `components['page-heading']` on `SmartProvider` to restyle every
 * `<SmartPageHeading>`, or render it directly.
 *
 * Unlike the standard page heading it renders a navbar-look `<header>`: a
 * brand zone (the `logoTpl`, followed by the `title` as an `<h1>` and the
 * `subtitle` under it), a desktop nav zone, an actions zone (an avatar zone
 * for the `user` layout) and a mobile hamburger toggling a collapsible panel,
 * laid out by `options.presentation.layout` (`links-left` default,
 * `links-center`, `links-right`, `user`). The breadcrumbs, banner, meta,
 * stats and filters slots are rendered by the standard page heading only.
 */
export function SmartPageHeadingPreset({
  options,
  className,
}: SmartPageHeadingProps) {
  const [menuOpened, setMenuOpened] = useState(false);

  const layout: PageHeadingPresetLayout =
    options?.presentation?.layout ?? 'links-left';
  const barClasses = getPageHeadingBarClasses(layout);

  const logoZone = (
    <div className="smart:flex smart:items-center smart:gap-3" data-role="logo">
      {options?.logoTpl ?? null}
      {options?.title || options?.subtitle ? (
        <div className="smart:min-w-0" data-role="heading">
          {options.title ? (
            <h1 className={TITLE_CLASSES} data-role="title">
              {options.title}
            </h1>
          ) : null}
          {options.subtitle ? (
            <p className={SUBTITLE_CLASSES} data-role="subtitle">
              {options.subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  const navZone = options?.navTpl ? (
    <div className="smart:hidden smart:md:block" data-role="nav">
      {options.navTpl}
    </div>
  ) : null;

  const actionsZone = options?.actionsTpl ? (
    <div
      className="smart:hidden smart:md:flex smart:items-center smart:gap-4"
      data-role="actions"
    >
      {options.actionsTpl}
    </div>
  ) : null;

  const avatarZone = options?.avatarTpl ? (
    <div
      className="smart:hidden smart:md:relative smart:md:block"
      data-role="avatar"
    >
      {options.avatarTpl}
    </div>
  ) : null;

  const hamburgerZone = (
    <button
      type="button"
      className={HAMBURGER_CLASSES}
      onClick={() => setMenuOpened((opened) => !opened)}
      data-role="hamburger"
      aria-label="Toggle menu"
    >
      <span className="smart:sr-only">Toggle menu</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="smart:size-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        ></path>
      </svg>
    </button>
  );

  let bar;
  switch (layout) {
    case 'links-center':
      bar = (
        <div className={barClasses}>
          {logoZone}
          <div className="smart:hidden smart:md:flex smart:md:flex-1 smart:md:justify-center">
            {navZone}
          </div>
          <div className="smart:flex smart:items-center smart:gap-4">
            {actionsZone}
            {hamburgerZone}
          </div>
        </div>
      );
      break;
    case 'links-right':
      bar = (
        <div className={barClasses}>
          <div className="smart:flex smart:flex-1 smart:items-center">
            {logoZone}
          </div>
          <div className="smart:hidden smart:md:flex smart:md:items-center smart:md:gap-12">
            {navZone}
            {actionsZone}
          </div>
          {hamburgerZone}
        </div>
      );
      break;
    case 'user':
      bar = (
        <div className={barClasses}>
          <div className="smart:flex smart:flex-1 smart:items-center">
            {logoZone}
          </div>
          <div className="smart:hidden smart:md:flex smart:md:items-center smart:md:gap-12">
            {navZone}
            {avatarZone}
          </div>
          {hamburgerZone}
        </div>
      );
      break;
    default:
      bar = (
        <div className={barClasses}>
          {logoZone}
          <div className="smart:flex smart:flex-1 smart:items-center smart:justify-end smart:md:justify-between">
            {navZone}
            <div className="smart:flex smart:items-center smart:gap-4">
              {actionsZone}
              {hamburgerZone}
            </div>
          </div>
        </div>
      );
  }

  return (
    <header
      className={cn(getPageHeadingHeaderClasses(), className)}
      data-role="header"
    >
      <div className="smart:mx-auto smart:max-w-7xl smart:px-4 smart:sm:px-6 smart:lg:px-8">
        {bar}
      </div>

      {menuOpened ? (
        <div
          className="smart:md:hidden smart:px-4 smart:pb-4"
          data-role="mobile-panel"
        >
          {options?.navTpl ? options.navTpl : null}
          {options?.actionsTpl ? (
            <div className="smart:mt-4">{options.actionsTpl}</div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
