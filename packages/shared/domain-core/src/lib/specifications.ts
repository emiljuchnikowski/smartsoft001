import {ISpecification} from "./interfaces";

/**
 * BasicSpecification is a class that implements the `ISpecification` interface and serves as a base
 * class for defining basic query criteria. It holds a single set of criteria that can be used to
 * filter entities in a repository or database.
 *
 * This class can be extended to create more complex specifications by combining or modifying the
 * base criteria.
 *
 * @class BasicSpecification
 * @implements {ISpecification}
 */
export class BasicSpecification implements ISpecification {

    /**
     * Creates an instance of BasicSpecification.
     *
     * @param {any} criteria - The criteria used to filter entities.
     */
    constructor(public readonly criteria: any) { }
}

/**
 * MergeSpecification is a class that extends `BasicSpecification` and allows for the merging of multiple
 * specifications into a single specification. The resulting specification combines the criteria of all provided
 * specifications using a shallow merge.
 *
 * This class is useful when you need to apply multiple specifications to a query in a way that combines their criteria.
 *
 * @class MergeSpecification
 * @extends {BasicSpecification}
 */
export class MergeSpecification extends BasicSpecification {

    /**
     * Creates an instance of MergeSpecification.
     *
     * @param {...ISpecification[]} specs - An array of specifications to be merged.
     */
    constructor(...specs: Array<ISpecification>) {
        let criteria = {};

        specs.forEach(spec => {
           criteria = {
               ...criteria,
               ...spec.criteria
           }
        });

        super(criteria);
    }
}

/**
 * OrSpecification is a class that extends `BasicSpecification` and allows for the combination of
 * multiple specifications using a logical OR operation. The resulting specification matches entities that satisfy
 * at least one of the provided specifications.
 *
 * This class is useful when you need to apply multiple specifications to a query in a way that matches entities
 * that meet any of the specified criteria.
 *
 * @class OrSpecification
 * @extends {BasicSpecification}
 */
export class OrSpecification extends BasicSpecification {

    /**
     * Creates an instance of OrSpecification.
     *
     * @param {...ISpecification[]} spec - An array of specifications to be combined using a logical OR.
     */
    constructor(...spec: Array<ISpecification>) {
        super({
            $or: spec.map(c => c.criteria)
        });
    }
}

/**
 * AndSpecification is a class that extends `BasicSpecification` and allows for the combination of
 * multiple specifications using a logical AND operation. The resulting specification matches entities that satisfy
 * all the provided specifications.
 *
 * This class is useful when you need to apply multiple specifications to a query in a way that matches entities
 * that meet all the specified criteria.
 *
 * @class AndSpecification
 * @extends {BasicSpecification}
 */
export class AndSpecification extends BasicSpecification {

    /**
     * Creates an instance of AndSpecification.
     *
     * @param {...ISpecification[]} spec - An array of specifications to be combined using a logical AND.
     */
    constructor(...spec: Array<ISpecification>) {
        super({
            $and: spec.map(c => c.criteria)
        });
    }
}
