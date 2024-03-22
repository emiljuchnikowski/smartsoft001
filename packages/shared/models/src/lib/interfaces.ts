import {Observable} from "rxjs";

export enum FieldTypeDef {
    address = "address",
    currency = "currency",
    date = "date",
    dateTime = "dateTime",
    dateWithEdit = "dateWithEdit",
    email = "email",
    enum = "enum",
    file = "file",
    flag = "flag",
    int = "int",
    nip = "nip",
    object = "object",
    array = "array",
    password = "password",
    radio = "radio",
    text = "text",
    strings = "strings",
    ints = "ints",
    longText = "longText",
    color = "color",
    logo = "logo",
    check = "check",
    phoneNumber = "phoneNumber",
    phoneNumberPl = "phoneNumberPl",
    pesel = "pesel",
    pdf = "pdf",
    video = "video",
    attachment = "attachment",
    dateRange = "dateRange",
    image = "image",
    float = "float"
}
export const FieldType: typeof FieldTypeDef = FieldTypeDef;

export interface ISpecification {
    criteria: any;
}

export interface IModelFilter {
    label?: string;
    fieldType?: FieldTypeDef;
    key: string;
    type: '=' | '!=' | '>=' | '<=' | '<' | '>' | '~=';
    possibilities$?: Observable<{ id: any, text: string }[]>;
}

export interface IModelStep {
    number: number;
    name: string;
}

export interface IModelMetadata {
    titleKey?: string;
    permissions?: Array<string>;
    filters?: Array<IModelFilter>;
}

export interface IFieldMetadata extends IFieldModifyMetadata {
    type?: FieldTypeDef;
    classType?: any;
    possibilities?: Array<any> | any;
}

export interface IFieldModifyMetadata {
    required?: boolean;
    focused?: boolean;
    confirm?: boolean;
    permissions?: Array<string>;
    unique?: boolean | IFieldUniqueMetadata;
    defaltValue?: () => any;
    enabled?: ISpecification;
    hide?: boolean;
    /**
     * @desc - Model step configuration
     */
    step?: IModelStep;
}

export interface IFieldEditMetadata extends IFieldModifyMetadata {
    multi?: boolean;
}

export interface IFieldListMetadata {
    order?: number;
    filter?: boolean;
    permissions?: Array<string>;
    /**
     * Configuration for dynamic list table data
     * @param {string} dynamic.headerKey - column header object key
     * @param {string} dynamic.rowKey - column row value object key
     */
    dynamic?: { headerKey: string, rowKey: string }
}

export interface IFieldDetailsMetadata {
    order?: number;
    permissions?: Array<string>;
    enabled?: ISpecification;
}

export interface IModelOptions {
    titleKey?: string;
    filters?: Array<IModelFilter>;
    create?: IModelModeOptions;
    update?: IModelModeOptions;
    list?: IModelModeOptions;
    details?: IModelModeOptions;
    remove?: IModelModeOptions;
    customs?: Array<IModelModeOptionsCustom>;
    /**
     * @desc - Allow export field data
     */
    export?: boolean;
    /**
     * @desc - Allow import field data
     */
    import?: boolean;
}

export interface IModelModeOptions {
    permissions?: Array<string>;
    enabled?: ISpecification;
}

export interface IModelModeOptionsCustom extends IModelModeOptions {
    mode: string;
}

export interface IFieldOptions extends IFieldMetadata {
    create?: IFieldModifyMetadata | boolean;
    update?: IFieldEditMetadata | boolean;
    list?: IFieldListMetadata | boolean;
    details?: IFieldDetailsMetadata | boolean;
    customs?: Array<IModelMetadataCustom>;
    search?: boolean;
    info?: string;
}

export interface IModelMetadataCustom extends IModelMetadata {
    mode: string
}

export interface IFieldUniqueMetadata {
    withFields?: Array<string>;
}

export interface IFieldCustomMetadata extends IFieldModifyMetadata, IFieldListMetadata {
    mode: string;
}
