import { ISpecification } from './interfaces';
import {
  BasicSpecification,
  MergeSpecification,
  OrSpecification,
  AndSpecification,
} from './specifications';

describe('shared-domain-core: BasicSpecification', () => {
  it('should create a BasicSpecification with the given criteria', () => {
    const criteria = { key: 'value' };

    const spec = new BasicSpecification(criteria);

    expect(spec.criteria).toEqual(criteria);
  });
});

describe('shared-domain-core: MergeSpecification', () => {
  it('should merge multiple specifications into one', () => {
    const spec1: ISpecification = { criteria: { key1: 'value1' } };
    const spec2: ISpecification = { criteria: { key2: 'value2' } };

    const spec = new MergeSpecification(spec1, spec2);

    expect(spec.criteria).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
  });

  it('should override criteria with the same key', () => {
    const spec1: ISpecification = { criteria: { key: 'value1' } };
    const spec2: ISpecification = { criteria: { key: 'value2' } };

    const spec = new MergeSpecification(spec1, spec2);

    expect(spec.criteria).toEqual({
      key: 'value2',
    });
  });
});

describe('shared-domain-core: OrSpecification', () => {
  it('should combine multiple specifications using logical OR', () => {
    const spec1: ISpecification = { criteria: { key1: 'value1' } };
    const spec2: ISpecification = { criteria: { key2: 'value2' } };

    const spec = new OrSpecification(spec1, spec2);

    expect(spec.criteria).toEqual({
      $or: [{ key1: 'value1' }, { key2: 'value2' }],
    });
  });
});

describe('shared-domain-core: AndSpecification', () => {
  it('should combine multiple specifications using logical AND', () => {
    const spec1: ISpecification = { criteria: { key1: 'value1' } };
    const spec2: ISpecification = { criteria: { key2: 'value2' } };

    const spec = new AndSpecification(spec1, spec2);

    expect(spec.criteria).toEqual({
      $and: [{ key1: 'value1' }, { key2: 'value2' }],
    });
  });
});
