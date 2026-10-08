import { IDetailOptions } from '../../models';

/**
 * The props of every detail field component: the inputs of the Angular
 * `DetailBaseComponent` (`options`, and `class` as `className`).
 */
export interface SmartDetailFieldProps<T = any> {
  options?: IDetailOptions<T>;
  className?: string;
}

export interface SmartDetailProps<T = any> {
  options: IDetailOptions<T> | undefined;
  /** The model class, for the label (`smartModelLabel`). */
  type: any;
  /** Forwarded to the field component. */
  className?: string;
}
