/** Exports a model's value, e.g. to a file. */
export abstract class IModelExportProvider {
  abstract execute(type: any, value: any): void;
}
