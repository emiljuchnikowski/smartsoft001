// #region usage
import { useState } from 'react';

import { IToggleOptions, SmartToggle } from '@smartsoft001/react';

const options: IToggleOptions = {
  label: 'Email notifications',
  description: 'Get an email when someone comments on your post.',
};

export function ToggleUsageExample() {
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <>
      <SmartToggle
        options={options}
        value={emailNotifications}
        onValueChange={setEmailNotifications}
      />
      <p>Email notifications are {emailNotifications ? 'on' : 'off'}.</p>
    </>
  );
}
// #endregion
