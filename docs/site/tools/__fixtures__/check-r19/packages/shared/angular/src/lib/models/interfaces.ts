export interface IButtonOptions {
  label?: string
  size: string
  disabled$?: unknown
  type?: 'button' | 'submit'
}

export type SmartModalVariant = 'dialog' | 'sheet'

export interface IListOptions {
  title: string
}

export enum SmartColumnType {
  Text,
  Number,
}

export interface ISortState {
  key: string
}

export interface ITableOptions {
  density?: 'compact' | 'comfortable'
}
