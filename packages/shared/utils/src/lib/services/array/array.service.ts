import * as _ from 'lodash';

export class ArrayService {
  /**
   * pushing item to input array and creating new array with same items
   * @param array {array} - input array
   * @param item {object} - new item
   * @returns {array} - new array with item
   */
  static addItem<T>(array: Array<T>, item: T): Array<T> {
    array.push(item);

    return [...array];
  }

  /**
   * removing item from input array and creating new array without item
   * @param array {array} - input array
   * @param item {object} - item to remove
   * @returns {array} - new array without item
   */
  static removeItem<T>(array: Array<T>, item: T): Array<T> {
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    }

    return [...array];
  }

  /**
   * sort array
   * @param array {array} - input array
   * @param by {function} - function to get sort key
   * @returns {array} - sorted array
   */
  static sort<T>(array: Array<T>, by: (item: T) => unknown): Array<T> {
    return _.sortBy(array, by);
  }
}
