import { IBreadcrumbsOptions } from '../../models';

/** Payload of `onItemClick` (the Angular `itemClick` output). */
export interface IBreadcrumbsItemClick {
  itemId: string;
}

export interface SmartBreadcrumbsProps {
  options?: IBreadcrumbsOptions;
  className?: string;
  /** Click on an item without `href` (rendered as a button). */
  onItemClick?: (event: IBreadcrumbsItemClick) => void;
}
