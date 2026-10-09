import type { ReactNode } from 'react';

import {
  getActionPanelActionClasses,
  getActionPanelCardClasses,
  getActionPanelDescriptionClasses,
  getActionPanelTitleClasses,
  getActionPanelWellClasses,
} from './preset-classes';
import { IActionPanelAction, SmartActionPanelLayout } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartActionPanelProps } from '../action-panel.types';

function getActionsContainerClasses(layout: SmartActionPanelLayout): string {
  switch (layout) {
    case 'right-button':
      return 'smart:flex smart:flex-col smart:gap-2';
    case 'top-right-button':
      return 'smart:flex smart:shrink-0 smart:gap-2';
    case 'with-link':
      return 'smart:mt-2 smart:flex smart:flex-wrap smart:gap-4';
    default:
      return 'smart:mt-4 smart:flex smart:flex-wrap smart:gap-2';
  }
}

/**
 * Styled action-panel variation (preset). Register it as
 * `components['action-panel']` on `SmartProvider` to restyle every
 * `<SmartActionPanel>`, or render it directly.
 *
 * Renders the panel as a bordered card and realizes all eight
 * `SmartActionPanelLayout` arrangements (`options.layout`, `simple` by
 * default): the title, description, content slot and actions are re-composed
 * per layout (row, split, well, ...).
 */
export function SmartActionPanelPreset({
  options,
  className = '',
  onActionClick,
}: SmartActionPanelProps) {
  const layout: SmartActionPanelLayout = options?.layout ?? 'simple';
  const actions = options?.actions ?? [];

  const titleZone = options?.title && (
    <h3 className={getActionPanelTitleClasses()} data-role="title">
      {options.title}
    </h3>
  );

  const descriptionZone = options?.descriptionTpl ? (
    <div className={getActionPanelDescriptionClasses()} data-role="description">
      {options.descriptionTpl}
    </div>
  ) : (
    options?.description && (
      <p className={getActionPanelDescriptionClasses()} data-role="description">
        {options.description}
      </p>
    )
  );

  const contentZone = options?.contentTpl && (
    <div className="smart:mt-3" data-role="content">
      {options.contentTpl}
    </div>
  );

  const actionClasses = (variant: IActionPanelAction['variant']) =>
    getActionPanelActionClasses(variant, layout === 'with-link');

  const actionsZone = actions.length > 0 && (
    <div className={getActionsContainerClasses(layout)} data-role="actions">
      {actions.map((action) =>
        action.href ? (
          <a
            key={action.id}
            href={action.href}
            className={actionClasses(action.variant)}
            data-role="action"
            data-action-id={action.id}
          >
            {action.iconTpl}
            {action.label}
          </a>
        ) : (
          <button
            key={action.id}
            type="button"
            className={actionClasses(action.variant)}
            data-role="action"
            data-action-id={action.id}
            onClick={() => onActionClick?.({ actionId: action.id })}
          >
            {action.iconTpl}
            {action.label}
          </button>
        ),
      )}
    </div>
  );

  let body: ReactNode;
  switch (layout) {
    case 'right-button':
      body = (
        <div className="smart:flex smart:items-center smart:justify-between smart:gap-4">
          <div className="smart:flex-1">
            {titleZone}
            {descriptionZone}
            {contentZone}
          </div>
          {actionsZone}
        </div>
      );
      break;
    case 'top-right-button':
      body = (
        <>
          <div className="smart:flex smart:items-start smart:justify-between smart:gap-4">
            {titleZone}
            {actionsZone}
          </div>
          {descriptionZone}
          {contentZone}
        </>
      );
      break;
    case 'with-toggle':
      body = (
        <>
          <div className="smart:flex smart:items-center smart:justify-between smart:gap-4">
            <div className="smart:flex-1">
              {titleZone}
              {descriptionZone}
            </div>
            {contentZone}
          </div>
          {actionsZone}
        </>
      );
      break;
    case 'well':
      body = (
        <>
          {titleZone}
          {descriptionZone}
          <div className={getActionPanelWellClasses()} data-role="well">
            {contentZone}
            {actionsZone}
          </div>
        </>
      );
      break;
    default:
      // 'simple', 'with-link', 'with-input' and 'payment-method' share the
      // stacked arrangement.
      body = (
        <>
          {titleZone}
          {descriptionZone}
          {contentZone}
          {actionsZone}
        </>
      );
  }

  return (
    <div
      className={cn(getActionPanelCardClasses(), className)}
      data-role="panel"
      data-layout={layout}
    >
      {body}
    </div>
  );
}
