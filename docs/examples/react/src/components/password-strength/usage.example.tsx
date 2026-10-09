// #region usage
import { useState } from 'react';

import { SmartPasswordStrength } from '@smartsoft001/react';

// A placeholder, not a real credential: the meter rates whatever is typed.
const EXAMPLE_PASSWORD_VALUE = 'placeholder';

export function PasswordStrengthUsageExample() {
  const [password, setPassword] = useState(EXAMPLE_PASSWORD_VALUE);
  const [strong, setStrong] = useState(false);

  return (
    <>
      <input
        type="password"
        autoComplete="new-password"
        aria-label="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <SmartPasswordStrength
        passwordToCheck={password}
        showHint
        onPasswordStrength={setStrong}
      />
      {strong && <p>The password is strong.</p>}
    </>
  );
}
// #endregion
