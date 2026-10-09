// #region usage
import { useState } from 'react';

import { SmartDateEdit } from '@smartsoft001/react';

export function DateEditUsageExample() {
  const [birthDate, setBirthDate] = useState('1990-04-07');
  const [isValid, setIsValid] = useState(true);

  return (
    <>
      <SmartDateEdit
        variant="standard"
        value={birthDate}
        onValueChange={setBirthDate}
        onValidChange={setIsValid}
      />
      {!isValid && <p>Enter a valid date of birth.</p>}
    </>
  );
}
// #endregion
