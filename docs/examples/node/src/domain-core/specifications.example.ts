// #region usage
import {
  AndSpecification,
  BasicSpecification,
  OrSpecification,
} from '@smartsoft001/domain-core';

/** Active users that are either an admin or an owner. */
export const activeAdminsOrOwners = new AndSpecification(
  new BasicSpecification({ status: 'active' }),
  new OrSpecification(
    new BasicSpecification({ role: 'admin' }),
    new BasicSpecification({ role: 'owner' }),
  ),
);

/** The plain object a repository receives: { $and: [...] } with a nested $or. */
export const activeAdminsOrOwnersCriteria = activeAdminsOrOwners.criteria;
// #endregion
