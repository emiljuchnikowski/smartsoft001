// #region usage
import { useState } from 'react';

import { SmartButton, SmartSectionHeading } from '@smartsoft001/react';

export function SectionHeadingUsageExample() {
  const [invited, setInvited] = useState(false);

  return (
    <>
      <SmartSectionHeading
        options={{
          title: 'Team members',
          label: '12 members',
          description: 'People who can access this project.',
          // Slots are plain React nodes passed inside the options.
          actionsTpl: (
            <SmartButton
              options={{ variant: 'primary', click: () => setInvited(true) }}
            >
              Invite member
            </SmartButton>
          ),
        }}
      />
      {invited && <p>Invitation sent.</p>}
    </>
  );
}
// #endregion
