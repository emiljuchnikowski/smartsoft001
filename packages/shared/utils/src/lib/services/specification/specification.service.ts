export interface ISpecificationCustom {
  $root?: any;
}

export const SPECIFICATION_ROOT_KEY = '$root.';

export class SpecificationService {
  /**
   * Checking if the value meets the specifications
   * @param value {object} - object to check
   * @param spec {ISpecificatio} - specification
   * @param custom {ISpecificationCustom} - custom data for valid
   */
  static valid<T>(
    value: T,
    spec: { criteria: any },
    custom?: ISpecificationCustom,
  ): boolean {
    const keys = Object.keys(spec.criteria);

    if (!value) return false;

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];

      if (key.indexOf(SPECIFICATION_ROOT_KEY) === 0 && custom?.$root) {
        if (
          !SpecificationService.check(
            custom?.$root[key.replace(SPECIFICATION_ROOT_KEY, '')],
            spec.criteria[key],
          )
        )
          return false;
      } else if (
        !SpecificationService.check((value as any)[key], spec.criteria[key])
      )
        return false;
    }

    return true;
  }

  /**
   * Checking if the object does not meet the specifications
   * @param value {object} - object to check
   * @param spec {ISpecificatio} - specification
   * @param custom {ISpecificationCustom} - custom data for invalid
   */
  static invalid<T>(
    value: T,
    spec: { criteria: any },
    custom?: ISpecificationCustom,
  ): boolean {
    return !SpecificationService.valid(value, spec, custom);
  }

  /**
   * Convert specification to sql
   * @param spec {ISpecificatio} - specification
   * @return - sql criteria
   */
  static getSqlCriteria(spec: { criteria: any }): string {
    const keys = Object.keys(spec.criteria);
    let result = '';

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const val = spec.criteria[key];

      if (index) result += ' and ';

      result += `${key} = ${typeof val === 'number' ? val : "'" + val + "'"}`;
    }

    return result;
  }

  private static check(value: any, criteriaValue: any): boolean {
    if (value && Array.isArray(value)) {
      return value.some((i) => i === criteriaValue);
    }

    return value === criteriaValue;
  }
}
