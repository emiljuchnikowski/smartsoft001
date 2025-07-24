import {IModelFilter} from "@smartsoft001/models";
import {PaginationMode} from "@smartsoft001/angular";

export interface ICrudFilter {
    searchText?: string;
    sortBy?: string;
    sortDesc?: boolean;
    offset?: number;
    limit?: number;
    paginationMode?: PaginationMode;
    query?: Array<ICrudFilterQueryItem>
}

export interface ICrudFilterQueryItem extends IModelFilter {
    key: string;
    value: any;
    type: '=' | '!=' | '>=' | '<=' | '<' | '>';
    hidden?: boolean;
}

export interface ICrudCreateManyOptions {
    mode: CrudCreateManyMode
}

export interface ICrudListGroup {
    key: string;
    value: string;
    text: string;
    show?: boolean;
    changed?: boolean;
    children?: Array<ICrudListGroup>;
}

export type CrudCreateManyMode = 'default' | 'replace';
