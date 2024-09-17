/*
 * Interface for entities
 */
export interface IEntity<T> {
  id: T;
}

/*
 * Address interface
 */
export interface IAddress {
  city: string;
  street: string;
  buildingNumber: string;
  flatNumber?: string;
  zipCode: string;
}

/*
 * Date range interface
 */
export interface IDateRange {
  /*
   * YYYY-MM-DD
   */
  start: `${string}-${string}-${string}`;
  /*
   * YYYY-MM-DD
   */
  end: `${string}-${string}-${string}`;
}

/*
 * Factory interface
 */
export interface IFactory<T, TConfig> {
  create(config: NonNullable<TConfig>): Promise<T>;
}

export { ISpecification } from '@smartsoft001/models';
