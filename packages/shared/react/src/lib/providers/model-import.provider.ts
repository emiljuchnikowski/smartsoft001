/** Turns an uploaded file into a model's value. */
export abstract class IModelImportProvider {
  abstract getAccept(type: any): Promise<string>;
  abstract convert(type: any, file: File): Promise<any>;
}
