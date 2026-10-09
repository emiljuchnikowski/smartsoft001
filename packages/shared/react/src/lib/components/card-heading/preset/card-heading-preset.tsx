import {
  CardHeadingVariant,
  getCardHeadingContainerClasses,
} from './preset-classes';
import { ICardHeadingOptions } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartCardHeadingProps } from '../card-heading.types';

/**
 * HyperUI-styled card heading variation (preset). Register it as
 * `components['card-heading']` on `SmartProvider`, or render it directly.
 *
 * Restyles the heading with one of four HyperUI card looks, driven by
 * `options.presentation.variant`: `author` (default), `stacked`, `overlay`, or
 * `outline`. Content comes from the shared `ICardHeadingOptions` slots (title,
 * description, avatarTpl, metaTpl, actionsTpl).
 */
export function SmartCardHeadingPreset({
  options,
  className = '',
}: SmartCardHeadingProps) {
  const variant: CardHeadingVariant =
    options?.presentation?.variant ?? 'author';

  return (
    <div
      data-role="card"
      className={cn(getCardHeadingContainerClasses(variant), className)}
    >
      <CardHeadingPresetContent variant={variant} options={options} />
    </div>
  );
}

function CardHeadingPresetContent({
  variant,
  options,
}: {
  variant: CardHeadingVariant;
  options?: ICardHeadingOptions;
}) {
  switch (variant) {
    case 'stacked':
      return <StackedContent options={options} />;
    case 'overlay':
      return <OverlayContent options={options} />;
    case 'outline':
      return <OutlineContent options={options} />;
    default:
      return <AuthorContent options={options} />;
  }
}

function StackedContent({ options }: { options?: ICardHeadingOptions }) {
  return (
    <>
      {options?.avatarTpl ? (
        <div data-role="avatar">{options.avatarTpl}</div>
      ) : null}
      {options?.title ? (
        <h3
          data-role="title"
          className="smart:mt-4 smart:text-lg smart:font-bold smart:text-gray-900 smart:dark:text-white smart:sm:text-xl"
        >
          {options.title}
        </h3>
      ) : null}
      {options?.description ? (
        <p
          data-role="description"
          className="smart:mt-2 smart:max-w-sm smart:text-gray-700 smart:dark:text-gray-300"
        >
          {options.description}
        </p>
      ) : null}
      {options?.metaTpl ? (
        <dl data-role="meta" className="smart:mt-4 smart:flex smart:gap-4">
          {options.metaTpl}
        </dl>
      ) : null}
      {options?.actionsTpl ? (
        <div data-role="actions" className="smart:mt-4">
          {options.actionsTpl}
        </div>
      ) : null}
    </>
  );
}

function OverlayContent({ options }: { options?: ICardHeadingOptions }) {
  return (
    <>
      {options?.avatarTpl ? (
        <div data-role="avatar" className="smart:absolute smart:inset-0">
          {options.avatarTpl}
        </div>
      ) : null}
      <div className="smart:relative smart:p-4 smart:sm:p-6 smart:lg:p-8">
        {options?.metaTpl ? (
          <div
            data-role="meta"
            className="smart:text-sm smart:font-medium smart:tracking-widest smart:text-pink-500 smart:uppercase"
          >
            {options.metaTpl}
          </div>
        ) : null}
        {options?.title ? (
          <p
            data-role="title"
            className="smart:text-xl smart:font-bold smart:text-white smart:sm:text-2xl"
          >
            {options.title}
          </p>
        ) : null}
        <div className="smart:mt-32 smart:sm:mt-48 smart:lg:mt-64">
          <div className="smart:translate-y-8 smart:transform smart:opacity-0 smart:transition-all smart:group-hover:translate-y-0 smart:group-hover:opacity-100">
            {options?.description ? (
              <p
                data-role="description"
                className="smart:text-sm smart:text-white"
              >
                {options.description}
              </p>
            ) : null}
            {options?.actionsTpl ? (
              <div
                data-role="actions"
                className="smart:mt-4 smart:text-sm smart:font-bold smart:text-white"
              >
                {options.actionsTpl}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

function OutlineContent({ options }: { options?: ICardHeadingOptions }) {
  return (
    <>
      <span className="smart:absolute smart:inset-0 smart:border-2 smart:border-dashed smart:border-black smart:dark:border-white"></span>
      <div className="smart:relative smart:flex smart:h-full smart:transform smart:items-end smart:border-2 smart:border-black smart:dark:border-white smart:bg-white smart:dark:bg-gray-900 smart:transition-transform smart:group-hover:-translate-x-2 smart:group-hover:-translate-y-2">
        <div className="smart:px-4 smart:pb-4 smart:transition-opacity smart:group-hover:absolute smart:group-hover:opacity-0 smart:sm:px-6 smart:sm:pb-4 smart:lg:px-8 smart:lg:pb-8">
          {options?.avatarTpl ? (
            <div data-role="avatar">{options.avatarTpl}</div>
          ) : null}
          {options?.title ? (
            <h2
              data-role="title"
              className="smart:mt-4 smart:text-xl smart:font-medium smart:text-gray-900 smart:dark:text-white smart:sm:text-2xl"
            >
              {options.title}
            </h2>
          ) : null}
        </div>
        <div className="smart:absolute smart:p-4 smart:opacity-0 smart:transition-opacity smart:group-hover:relative smart:group-hover:opacity-100 smart:sm:p-6 smart:lg:p-8">
          {options?.title ? (
            <h3
              data-role="title-hover"
              className="smart:mt-4 smart:text-xl smart:font-medium smart:text-gray-900 smart:dark:text-white smart:sm:text-2xl"
            >
              {options.title}
            </h3>
          ) : null}
          {options?.description ? (
            <p
              data-role="description"
              className="smart:mt-4 smart:text-sm smart:text-gray-900 smart:dark:text-white smart:sm:text-base"
            >
              {options.description}
            </p>
          ) : null}
          {options?.actionsTpl ? (
            <div
              data-role="actions"
              className="smart:mt-8 smart:font-bold smart:text-gray-900 smart:dark:text-white"
            >
              {options.actionsTpl}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function AuthorContent({ options }: { options?: ICardHeadingOptions }) {
  return (
    <>
      <div className="smart:sm:flex smart:sm:justify-between smart:sm:gap-4 smart:lg:gap-6">
        {options?.avatarTpl ? (
          <div
            data-role="avatar"
            className="smart:sm:order-last smart:sm:shrink-0"
          >
            {options.avatarTpl}
          </div>
        ) : null}
        <div className="smart:mt-4 smart:sm:mt-0">
          {options?.title ? (
            <h3
              data-role="title"
              className="smart:text-lg smart:font-medium smart:text-pretty smart:text-gray-900 smart:dark:text-white"
            >
              {options.title}
            </h3>
          ) : null}
          {options?.description ? (
            <p
              data-role="description"
              className="smart:mt-4 smart:line-clamp-2 smart:text-sm smart:text-pretty smart:text-gray-700 smart:dark:text-gray-300"
            >
              {options.description}
            </p>
          ) : null}
        </div>
      </div>
      {options?.metaTpl ? (
        <dl
          data-role="meta"
          className="smart:mt-6 smart:flex smart:gap-4 smart:lg:gap-6"
        >
          {options.metaTpl}
        </dl>
      ) : null}
      {options?.actionsTpl ? (
        <div data-role="actions" className="smart:mt-4">
          {options.actionsTpl}
        </div>
      ) : null}
    </>
  );
}
