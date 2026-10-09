import { useMemo } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import {
  getModelFieldsWithOptions,
  IFieldDetailsMetadata,
  IFieldOptions,
  ISpecification,
} from '@smartsoft001/models';
import { ObjectService, SpecificationService } from '@smartsoft001/utils';

import { SmartDetailsProps } from './details.types';
import { useAuthService, useDetailsService } from '../../providers/hooks';
import { AuthService } from '../../services/auth/auth.service';

export interface SmartDetailsField {
  key: string;
  options: IFieldOptions;
}

interface EnabledDefinition {
  key: string;
  spec: ISpecification;
}

/**
 * The fields of `type` marked `@Field({ details })` the user may see, and the
 * `enabled` specifications to check them against.
 */
function getDetailsFields(
  type: any,
  authService: Pick<AuthService, 'expectPermissions'>,
): { fields: SmartDetailsField[] | null; enabled: EnabledDefinition[] } {
  const enabled: EnabledDefinition[] = [];

  if (!type) return { fields: null, enabled };

  const fields = getModelFieldsWithOptions(new type())
    .filter((f) => f.options.details)
    .filter((field) => {
      const details = field.options.details as IFieldDetailsMetadata;

      if (details.enabled) {
        enabled.push({ key: field.key, spec: details.enabled });
      } else if (field.options.enabled) {
        enabled.push({ key: field.key, spec: field.options.enabled });
      }

      return !(
        details.permissions &&
        !authService.expectPermissions(details.permissions)
      );
    });

  return { fields, enabled };
}

/** The item as an instance of `type`, so getters and specifications work. */
function toItemOfType<T>(item: T | null | undefined, type: any) {
  if (!item) return item;

  if (type && item instanceof type) return item;
  if (type) return ObjectService.createByType<T>(item, type);

  return item;
}

/**
 * The logic every details variant shares:
 *
 * - `fields`: the fields of `options.type` marked `@Field({ details })`,
 *   without those whose `details.permissions` the user lacks and those whose
 *   `enabled` specification (`details.enabled`, else the field's `enabled`)
 *   the item fails; a specification can refer to the outermost details' item
 *   as `$root`;
 * - `item`: `options.item` as an instance of `options.type` (a plain API
 *   object is converted);
 * - `loading`, `cellPipe` and `componentFactories` from the options.
 *
 * The item becomes the `DetailsService` root while rendering, before nested
 * details evaluate their specifications (the service keeps the first root, so
 * the outermost details win; React effects would run the innermost first).
 */
export function useDetails<T extends IEntity<string>>({
  options,
}: SmartDetailsProps<T>) {
  const authService = useAuthService();
  const detailsService = useDetailsService();
  const type = options?.type;
  const rootItem = options?.item;

  if (rootItem) detailsService.setRoot(rootItem);

  const definitions = useMemo(
    () => getDetailsFields(type, authService),
    [type, authService],
  );

  const item = useMemo(
    () => toItemOfType(rootItem, type) as T | null | undefined,
    [rootItem, type],
  );

  let fields = definitions.fields;

  if (fields && item) {
    const removed = definitions.enabled
      .filter((def) =>
        SpecificationService.invalid(item, def.spec, {
          $root: detailsService.$root,
        }),
      )
      .map((def) => def.key);

    if (removed.length) {
      fields = fields.filter((f) => !removed.includes(f.key));
    }
  }

  return {
    fields,
    type,
    item,
    loading: options?.loading,
    cellPipe: options?.cellPipe ?? null,
    componentFactories: options?.componentFactories ?? null,
  };
}
