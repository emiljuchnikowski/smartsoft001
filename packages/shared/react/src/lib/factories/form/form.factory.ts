import 'reflect-metadata';

import {
  FieldType,
  getModelFieldsWithOptions,
  IFieldEditMetadata,
  IFieldModifyMetadata,
  IFieldOptions,
  IFieldUniqueMetadata,
  ISpecification,
  SYMBOL_FIELD,
  SYMBOL_MODEL,
} from '@smartsoft001/models';
import {
  PeselService,
  SPECIFICATION_ROOT_KEY,
  SpecificationService,
  ZipCodeService,
} from '@smartsoft001/utils';

import {
  SmartAbstractControl,
  SmartAsyncValidatorFn,
  SmartValidatorFn,
} from '../../forms/abstract-control';
import { SmartFormArray } from '../../forms/form-array';
import { SmartFormControl } from '../../forms/form-control';
import { SmartFormGroup } from '../../forms/form-group';
import { SmartValidators } from '../../forms/validators';
import { IModelValidatorsProvider } from '../../providers/model-validators.provider';
import { AuthService } from '../../services/auth/auth.service';
import { DetailsService } from '../../services/details/details.service';

export type SmartUniqueProvider = (
  values: Record<string, any>,
) => Promise<boolean>;

export interface IFormFactoryOptions {
  mode?: 'create' | 'update' | 'multiUpdate' | string;
  uniqueProvider?: SmartUniqueProvider;
  /** The root group, when building a nested object or array item. */
  root?: SmartAbstractControl;
}

export interface IFormFactoryDependencies {
  authService: Pick<AuthService, 'expectPermissions'>;
  detailsService?: DetailsService;
  validatorsProvider?: IModelValidatorsProvider | null;
}

interface EnabledDefinition {
  key: string;
  control: SmartAbstractControl;
  enabled: ISpecification;
}

/**
 * Builds a form from a `@Model` instance: one control per `@Field` the mode
 * includes, with the validators its options call for. The port keeps every
 * rule of the Angular `FormFactory`:
 *
 * - the mode picks the fields (`create`, `update`, `multiUpdate` for fields
 *   with `update.multi`, or a custom mode listed in `customs`) and merges the
 *   mode's options over the field's;
 * - a field whose `permissions` the user lacks is left out;
 * - `object` fields become nested groups, `array` fields arrays of groups,
 *   `address` a group of its five parts;
 * - `confirm` adds a `<key>Confirm` control that has to match;
 * - `unique` runs the `uniqueProvider` as an async validator;
 * - an `enabled` specification adds and removes the control as the value
 *   changes, evaluated against the root value when it names `$root`;
 * - a validators provider can replace the derived validators of any field.
 */
export class FormFactory {
  constructor(private readonly deps: IFormFactoryDependencies) {}

  static checkModelMeta<T>(obj: T): void {
    if (!obj) throw new Error('You should set object as param');
    if (!Reflect.hasMetadata(SYMBOL_MODEL, (obj as object).constructor))
      throw new Error('You should mark class with @Model decorator');
  }

  static getOptions<T>(obj: T, key: string): IFieldOptions {
    return Reflect.getMetadata(SYMBOL_FIELD, obj as object, key);
  }

  static getOptionsFromMode(
    options: IFieldOptions,
    mode?: 'create' | 'update' | string,
  ): IFieldOptions {
    if (!mode) return options;

    if (mode === 'create' && isObject(options.create)) {
      return { ...options, ...(options.create as IFieldModifyMetadata) };
    }

    if (mode === 'update' && isObject(options.update)) {
      return { ...options, ...(options.update as IFieldModifyMetadata) };
    }

    return options;
  }

  async create<T>(
    obj: T,
    ops: IFormFactoryOptions = {},
  ): Promise<SmartFormGroup> {
    const evaluators: Array<() => void> = [];
    const result = await this.build(obj, ops, evaluators);

    // The Angular factory only evaluated `enabled` once the form emitted its
    // first change. Running it here gives the form its final shape before
    // anything renders it, nested groups included.
    if (!ops.root) evaluators.forEach((evaluate) => evaluate());

    return result;
  }

  private async build<T>(
    obj: T,
    ops: IFormFactoryOptions,
    evaluators: Array<() => void>,
  ): Promise<SmartFormGroup> {
    FormFactory.checkModelMeta(obj);

    const result = SmartFormGroup.create();
    const source = obj as Record<string, any>;

    const fields = getModelFieldsWithOptions(obj).filter((field) => {
      return (
        !ops.mode ||
        (ops.mode === 'create' && field.options.create) ||
        (ops.mode === 'update' && field.options.update) ||
        (ops.mode === 'multiUpdate' &&
          (field.options?.update as IFieldEditMetadata)?.multi) ||
        (ops.mode !== 'create' &&
          ops.mode !== 'update' &&
          field.options.customs &&
          field.options.customs.some((custom) => custom.mode === ops.mode))
      );
    });

    const enabledDefinitions: EnabledDefinition[] = [];

    for (const field of fields) {
      const options = FormFactory.getOptionsFromMode(field.options, ops.mode);

      if (
        options.permissions &&
        !this.deps.authService.expectPermissions(options.permissions)
      ) {
        continue;
      }

      let control: SmartAbstractControl;

      if (field.options.type === FieldType.object) {
        control = await this.build(
          source[field.key],
          { ...ops, root: ops.root ?? result },
          evaluators,
        );
      } else if (field.options.type === FieldType.array) {
        const array = new SmartFormArray([]);

        for (const item of (source[field.key] as unknown[]) ?? []) {
          array.push(
            await this.build(
              item,
              { ...ops, root: ops.root ?? result },
              evaluators,
            ),
            { emitEvent: false },
          );
        }

        control = array;
      } else {
        control = this.createControl(obj, field, options?.required ?? false);
      }

      this.setValidators(
        field.key,
        control,
        options,
        result,
        ops.uniqueProvider,
      );

      if (this.deps.validatorsProvider) {
        const providerResult = await this.deps.validatorsProvider.get({
          key: field.key,
          instance: obj,
          type: (obj as object).constructor,
          base: {
            validators: control.validator ?? undefined,
            asyncValidators: control.asyncValidator ?? undefined,
          },
        });

        control.setValidators(providerResult?.validators ?? null);
        control.setAsyncValidators(providerResult?.asyncValidators ?? null);
      }

      // Setting validators does not recompute the status, so the control
      // still carries the one it had before it had any. Recompute it once
      // every validator is attached, or the group would be built from stale
      // child statuses and report VALID.
      control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      result.addControl(field.key, control, { emitEvent: false });

      if (options.confirm && options.type === FieldType.object) {
        throw Error('Object not supported confirms');
      }

      if (options.confirm) {
        const original = control;
        const confirmControl = new SmartFormControl(null, [
          SmartValidators.required,
          (c) => (c.value !== original.value ? { confirm: true } : null),
        ]);

        // The Angular confirm control only re-checked itself when it changed,
        // so editing the original field afterwards left a stale result.
        original.valueChanges.subscribe(() =>
          confirmControl.updateValueAndValidity(),
        );

        result.addControl(field.key + 'Confirm', confirmControl, {
          emitEvent: false,
        });
      }

      if (options.enabled) {
        enabledDefinitions.push({
          key: field.key,
          control,
          enabled: options.enabled,
        });
      }
    }

    if (enabledDefinitions.length) {
      this.registerEnabled(obj, result, enabledDefinitions, ops, evaluators);
    }

    return result;
  }

  private registerEnabled<T>(
    obj: T,
    result: SmartFormGroup,
    definitions: EnabledDefinition[],
    ops: IFormFactoryOptions,
    evaluators: Array<() => void>,
  ): void {
    const rootCheck =
      ops.root &&
      definitions.some(
        (d) =>
          d.enabled?.criteria &&
          Object.keys(d.enabled.criteria).some(
            (k) => k.indexOf(SPECIFICATION_ROOT_KEY) === 0,
          ),
      )
        ? ops.root
        : null;

    const evaluate = () => {
      for (const def of definitions) {
        const enabled = SpecificationService.valid(
          { ...(obj ? obj : {}), ...result.value },
          def.enabled,
          { $root: rootCheck?.value },
        );

        def.control.smartDisabled = !enabled;
      }

      if (rootCheck) this.deps.detailsService?.setRoot(rootCheck.value, true);

      for (const def of definitions) {
        if (!def.control.smartDisabled && !result.controls[def.key]) {
          result.addControl(def.key, def.control);
        } else if (def.control.smartDisabled && result.controls[def.key]) {
          result.removeControl(def.key);
        }
      }
    };

    (rootCheck ?? result).valueChanges.subscribe(evaluate);
    evaluators.push(evaluate);
  }

  private setValidators(
    key: string,
    control: SmartAbstractControl,
    options: IFieldOptions,
    form: SmartFormGroup,
    uniqueProvider?: SmartUniqueProvider,
  ): void {
    const result: SmartValidatorFn[] = [];
    const asyncResult: SmartAsyncValidatorFn[] = [];

    if (options.required) {
      result.push(SmartValidators.required);
    }

    if (options.type === FieldType.email) {
      result.push((c) => {
        if (!c.value) return null;

        const reg = new RegExp(
          '^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$',
        );

        return reg.test(c.value) ? null : { email: true };
      });
    }

    if (options.type === FieldType.phoneNumber) {
      result.push((c) => {
        if (!c.value) return null;

        const reg = new RegExp('^((\\+91-?)|0)?[0-9]{9}$');

        return reg.test(c.value) ? null : { phoneNumber: true };
      });
    }

    if (options.type === FieldType.pesel) {
      result.push((c) => {
        if (!c.value) return null;

        return PeselService.isValid(c.value) ? null : { pesel: true };
      });
    }

    const possibilities = options.possibilities as
      | { minLength?: number; maxLength?: number; min?: number; max?: number }
      | undefined;

    if (possibilities?.minLength) {
      result.push(SmartValidators.minLength(possibilities.minLength));
    }

    if (possibilities?.maxLength) {
      result.push(SmartValidators.maxLength(possibilities.maxLength));
    }

    if (possibilities?.min || possibilities?.min === 0) {
      result.push(SmartValidators.min(possibilities.min));
    }

    if (possibilities?.max || possibilities?.max === 0) {
      result.push(SmartValidators.max(possibilities.max));
    }

    if (options.unique && uniqueProvider) {
      asyncResult.push(async (c) => {
        const record: Record<string, any> = {
          [key]: options.type === FieldType.int ? c.value : `'${c.value}'`,
        };
        const withFields = (options.unique as IFieldUniqueMetadata)?.withFields;

        if (form.value && withFields) {
          for (const fieldKey of withFields) {
            record[fieldKey] = form.value[fieldKey];
          }
        }

        return (await uniqueProvider(record)) ? null : { invalidUnique: true };
      });
    }

    control.setValidators(result);
    control.setAsyncValidators(asyncResult);
  }

  private createControl<T>(
    obj: T,
    field: { key: string; options: IFieldOptions },
    required: boolean,
  ): SmartAbstractControl {
    let result: SmartAbstractControl;

    const zipCodeValidator: SmartValidatorFn = (c) =>
      c.value && ZipCodeService.isInvalid(c.value)
        ? { invalidZipCode: true }
        : null;

    switch (field.options.type) {
      case FieldType.address:
        result = new SmartFormGroup({
          city: new SmartFormControl(
            '',
            required ? [SmartValidators.required] : null,
          ),
          street: new SmartFormControl(
            '',
            required ? [SmartValidators.required] : null,
          ),
          buildingNumber: new SmartFormControl(
            '',
            required ? [SmartValidators.required] : null,
          ),
          flatNumber: new SmartFormControl(''),
          zipCode: new SmartFormControl(
            '',
            required
              ? [SmartValidators.required, zipCodeValidator]
              : [zipCodeValidator],
          ),
        });
        break;
      default:
        result = new SmartFormControl(null);
        break;
    }

    const source = obj as Record<string, any>;
    const value = source[field.key]
      ? source[field.key]
      : field.options.defaltValue
        ? field.options.defaltValue()
        : null;

    if (value) result.setValue(value, { emitEvent: false });

    result.updateValueAndValidity({ emitEvent: false });

    return result;
  }
}

function isObject(value: unknown): value is object {
  return (
    value !== null && (typeof value === 'object' || typeof value === 'function')
  );
}
