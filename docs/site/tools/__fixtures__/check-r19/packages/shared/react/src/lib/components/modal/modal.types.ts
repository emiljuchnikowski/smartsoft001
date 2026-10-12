export interface IModalActionClick {
  actionId: string
  close: boolean
}

export type ModalSize = 'sm' | 'md'

export interface SmartModalProps {
  open: boolean
}

export interface IModalHarness {
  open: boolean
}
