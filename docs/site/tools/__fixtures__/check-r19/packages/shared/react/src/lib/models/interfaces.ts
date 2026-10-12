export interface SmartPossibility {
  id: string
}

export interface IButtonOptions {
  label: string
  disabled?: unknown
  type?: 'button' | 'submit' | 'reset'
}

export type SmartModalVariant = 'dialog' | 'sheet' | 'fullscreen'

export interface IListOptions {
  title: string
}

export enum SmartColumnType {
  Text,
  Date,
}

export type ISortState = {
  key: string
}

export interface ITableOptions {
  density?: string
}
