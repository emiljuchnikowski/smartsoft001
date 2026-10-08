export interface IModelLabelOptions {
  key: string;
  instance?: any;
  type?: any;
}

/**
 * Supplies the label of a model field. Return nothing to fall back to the
 * `MODEL.<key>` translation.
 */
export abstract class IModelLabelProvider {
  abstract get(options: IModelLabelOptions): string | null | undefined;
}
