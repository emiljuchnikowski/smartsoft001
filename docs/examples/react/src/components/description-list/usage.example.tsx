// #region usage
import { useState } from 'react';

import {
  IDescriptionListOptions,
  SmartDescriptionList,
} from '@smartsoft001/react';

export function DescriptionListUsageExample() {
  const [editedField, setEditedField] = useState<string | null>(null);

  const options: IDescriptionListOptions = {
    title: 'Applicant information',
    description: 'Personal details and application.',
    items: [
      { label: 'Full name', value: 'Margot Foster' },
      { label: 'Application for', value: 'Backend Developer' },
      {
        label: 'Email address',
        value: 'margotfoster@example.com',
        actionTpl: (
          <button type="button" onClick={() => setEditedField('email')}>
            Update
          </button>
        ),
      },
      { label: 'Salary expectation', value: '$120,000' },
    ],
  };

  return (
    <>
      <SmartDescriptionList options={options} />
      {editedField && <p>Editing: {editedField}</p>}
    </>
  );
}
// #endregion
