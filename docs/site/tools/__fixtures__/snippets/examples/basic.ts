import { Injectable } from '@angular/core'

// #region service
@Injectable()
export class DemoService {
  run() {
    return 42
  }
}
// #endregion

export const other = 1
