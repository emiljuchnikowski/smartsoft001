// #region usage
import { BasicSpecification } from '@smartsoft001/domain-core';
import { SpecificationService } from '@smartsoft001/utils';

interface Account {
  id: string;
  status: string;
}

/** The same specification a repository would receive as query criteria. */
export const activeAccounts = new BasicSpecification({ status: 'active' });

/** Evaluates the specification in memory, without touching a repository. */
export function isActive(account: Account): boolean {
  return SpecificationService.valid(account, activeAccounts);
}
// #endregion
