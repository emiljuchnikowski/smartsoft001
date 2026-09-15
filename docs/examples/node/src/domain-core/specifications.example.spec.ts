import {
  activeAdminsOrOwners,
  activeAdminsOrOwnersCriteria,
} from './specifications.example';

describe('docs-examples-node: composed specifications', () => {
  it('should nest the or criteria inside the and criteria', () => {
    expect(activeAdminsOrOwnersCriteria).toEqual({
      $and: [
        { status: 'active' },
        { $or: [{ role: 'admin' }, { role: 'owner' }] },
      ],
    });
  });

  it('should expose the same criteria on the specification itself', () => {
    expect(activeAdminsOrOwners.criteria).toBe(activeAdminsOrOwnersCriteria);
  });
});
