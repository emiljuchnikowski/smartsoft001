import * as publicApi from './index';
import { AuthService } from './lib/services/auth/auth.service';

describe('auth-shell-app-services: public API', () => {
  it('should export the provider array a Nest module spreads', () => {
    // The crud and trans siblings both export `SERVICES`, and a module that
    // wires this package up spreads it into `providers` and `exports` rather
    // than naming every service by hand.
    expect(publicApi.SERVICES).toEqual([AuthService]);
  });
});
