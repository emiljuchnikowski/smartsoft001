// #region usage
import {
  castModel,
  Field,
  FieldType,
  getInvalidFields,
  Model,
} from '@smartsoft001/models';

@Model({ titleKey: 'name' })
export class Product {
  id?: string;

  // `required` declared inside the `create` block applies to the create mode
  // only. A bare `create: true` would mark the field as editable on create but
  // would also reset the top level `required` flag back to "not required".
  @Field({ type: FieldType.text, create: { required: true } })
  name?: string;

  @Field({ type: FieldType.currency, create: true })
  price?: number;

  // No `create` block, so `castModel` removes it from a create payload.
  @Field({ type: FieldType.text })
  internalNote?: string;
}

/** Returns the keys of the fields required on create that are still empty. */
export function missingFields(product: Product): Array<string> {
  return getInvalidFields(product, 'create', []);
}

/**
 * Strips everything that must not reach the create endpoint.
 * `castModel` mutates the object in place, so the example copies it first. It
 * keeps `id` plus every field marked for the mode, and deletes the rest,
 * including properties that carry no `@Field` decorator at all.
 */
export function toCreatePayload(product: Product): Product {
  const payload = Object.assign(new Product(), product);

  castModel(payload, 'create', []);

  return payload;
}
// #endregion
