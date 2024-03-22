import { IFieldOptions, IModelOptions } from "./interfaces";
import { SYMBOL_FIELD, SYMBOL_MODEL } from "./symbols";

export function getModelFieldKeys<T>(type: T): Array<string> {
  if (!(type as any)["__fields"]) return [];
  return Object.keys((type as any)["__fields"]);
}

export function getModelFieldOptions<T>(
  instance: T,
  fieldKey: string
): IFieldOptions {
  return Reflect.getMetadata(SYMBOL_FIELD, instance as any, fieldKey);
}

export function getModelFieldsWithOptions<T>(
  instance: T
): Array<{ key: string; options: IFieldOptions }> {
  const keys = getModelFieldKeys((instance as any).constructor);

  return keys.map((item) => {
    return {
      key: item,
      options: getModelFieldOptions(instance, item),
    };
  });
}

export function getModelOptions(type: any): IModelOptions {
  return Reflect.getMetadata(SYMBOL_MODEL, type);
}

export function isModel<T>(instance: T): boolean {
  if (!instance || !instance.constructor) return false;
  return Reflect.hasMetadata(SYMBOL_MODEL, instance.constructor);
}

export function getInvalidFields<T>(
  instance: T,
  mode: "create" | "update" | string,
  permissions: Array<string>
): Array<string> {
  const result: any[] = [];

  getModelFieldsWithOptions(instance).forEach(({ key, options }) => {
    let required = options.required;

    if (
      (mode === "create" || mode === "update") &&
      options[mode] &&
      options[mode]?.constructor
    ) {
      required = (options[mode] as IFieldOptions).required;

      if (
        required &&
        permissions &&
        (options[mode] as IFieldOptions).permissions
      ) {
        required = (options[mode] as IFieldOptions)?.permissions?.some((op) =>
          permissions.some((p) => p === op)
        );
      }
    }

    if (
        required
        && ((instance as any)[key] === null || (instance as any)[key] === undefined || (instance as any)[key] === '')
    ) result.push(key);
  });

  return result;
}

export function castModel<T>(
  instance: T,
  mode: "create" | "update" | string,
  permissions: Array<string>
): void {
  if (!isModel(instance)) return;

  const fieldsWithOptions = getModelFieldsWithOptions(instance);

  Object.keys(instance as any)
    .filter((key) => key !== "id")
    .forEach((key) => {
      const fieldWidthOptions =
          fieldsWithOptions.find((f) => f.key === key);

      if (!fieldWidthOptions) {
        delete (instance as any)[key];
        return;
      }

      if (
        (mode === "create" || mode === "update") &&
        (!fieldWidthOptions.options[mode] ||
          (permissions &&
            (fieldWidthOptions.options[mode] as IFieldOptions).permissions &&
            !(fieldWidthOptions.options[
              mode
            ] as IFieldOptions)?.permissions?.some((op) =>
              permissions.some((p) => op === p)
            )))
      ) {
        delete (instance as any)[key];
        return;
      } else if (
        mode !== "create" &&
        mode !== "update" &&
        (!fieldWidthOptions.options.customs ||
          !fieldWidthOptions.options.customs.some((c) => c.mode === mode))
      ) {
        delete (instance as any)[key];
        return;
      }
    });
}
