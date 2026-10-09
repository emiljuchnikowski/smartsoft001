// #region usage
import { ISmartTableOptions, SmartTable } from '@smartsoft001/react';

const options: ISmartTableOptions = {
  title: 'Users',
  description: 'Everyone in your account, with their title and role.',
  striped: true,
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'title', label: 'Title' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', align: 'right' },
  ],
  rows: [
    {
      name: 'Lindsay Walton',
      title: 'Front-end Developer',
      email: 'lindsay.walton@example.com',
      role: 'Member',
    },
    {
      name: 'Courtney Henry',
      title: 'Designer',
      email: 'courtney.henry@example.com',
      role: 'Admin',
    },
    {
      name: 'Tom Cook',
      title: 'Director of Product',
      email: 'tom.cook@example.com',
      role: 'Member',
    },
  ],
};

export function TableUsageExample() {
  return <SmartTable options={options} />;
}
// #endregion
