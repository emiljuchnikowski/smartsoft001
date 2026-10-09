// #region usage
import { useState } from 'react';

import { SmartSectionHeading } from '@smartsoft001/react';

export function SectionHeadingUsageExample() {
  const [invited, setInvited] = useState(false);

  return (
    <>
      <SmartSectionHeading
        options={{
          title: 'Team members',
          label: '12',
          description: 'People who can access this project.',
          // Slots are plain React nodes passed inside the options.
          actionsTpl: (
            <button type="button" onClick={() => setInvited(true)}>
              Invite member
            </button>
          ),
        }}
      />
      {invited && <p>Invitation sent.</p>}
    </>
  );
}
// #endregion
