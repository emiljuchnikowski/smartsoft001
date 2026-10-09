// #region usage
import { useState } from 'react';

import {
  cn,
  SmartPasswordStrength,
  SmartPasswordStrengthProps,
  SmartProvider,
  usePasswordStrength,
} from '@smartsoft001/react';

const VERDICTS: Record<string, string> = {
  poor: 'Poor',
  notGood: 'Could be better',
  good: 'Strong',
};

export function CustomPasswordStrength(props: SmartPasswordStrengthProps) {
  // usePasswordStrength rates the password, computes the bar and message
  // classes and calls onPasswordStrength whenever the rating changes.
  const { result, msg, barClasses, msgClass, containerClasses } =
    usePasswordStrength(props);

  const verdict = VERDICTS[msg] ?? '';
  const missing = [
    result.lowerLetters ? '' : 'a lowercase letter',
    result.upperLetters ? '' : 'an uppercase letter',
    result.symbols ? '' : 'a special character',
    result.passLength ? '' : 'more than 6 characters',
  ].filter(Boolean);

  return (
    <div className={containerClasses}>
      <div className="docs-password-strength__bars">
        {barClasses.map((barClass, index) => (
          <span
            key={index}
            className={cn('docs-password-strength__bar', barClass)}
          ></span>
        ))}
      </div>

      {verdict && (
        <p className={cn('docs-password-strength__msg', msgClass)}>{verdict}</p>
      )}

      {props.showHint && missing.length > 0 && (
        <ul className="docs-password-strength__hints">
          {missing.map((requirement) => (
            <li key={requirement} className="docs-password-strength__hint-item">
              {requirement}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'password-strength': CustomPasswordStrength };

export function PasswordStrengthCustomExample() {
  const [password, setPassword] = useState('abc');
  const [strong, setStrong] = useState(false);

  // Every SmartPasswordStrength below the provider renders CustomPasswordStrength.
  return (
    <SmartProvider components={components}>
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
    </SmartProvider>
  );
}
// #endregion
