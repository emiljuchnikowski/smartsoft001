import { Observable } from 'rxjs';

export interface IIconButtonOptions {
  icon: string;
  text?: string;
  handler?: () => void;
  component?: any;
  type?: 'default' | 'popover';
  disabled$?: Observable<boolean>;
  number?: number;
}
