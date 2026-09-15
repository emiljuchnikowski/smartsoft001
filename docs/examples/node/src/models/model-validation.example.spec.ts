import {
  Product,
  missingFields,
  toCreatePayload,
} from './model-validation.example';

function createProduct(): Product {
  const product = new Product();
  product.id = 'p-1';
  product.name = 'Office chair';
  product.price = 199;
  product.internalNote = 'supplier A';

  return product;
}

describe('docs-examples-node: Product model', () => {
  it('should report a required field that was left empty', () => {
    const product = createProduct();
    product.name = '';

    const result = missingFields(product);

    expect(result).toEqual(['name']);
  });

  it('should report nothing when every required field is filled', () => {
    const product = createProduct();

    const result = missingFields(product);

    expect(result).toEqual([]);
  });

  it('should keep the id and the fields marked for the create mode', () => {
    const product = createProduct();

    const payload = toCreatePayload(product);

    expect(payload).toEqual(
      expect.objectContaining({ id: 'p-1', name: 'Office chair', price: 199 }),
    );
  });

  it('should drop a field that is not marked for the create mode', () => {
    const product = createProduct();

    const payload = toCreatePayload(product);

    expect(Object.keys(payload)).not.toContain('internalNote');
  });

  it('should leave the source product untouched', () => {
    const product = createProduct();

    toCreatePayload(product);

    expect(product.internalNote).toBe('supplier A');
  });
});
