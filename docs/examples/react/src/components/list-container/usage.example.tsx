// #region usage
import { IListContainerOptions, SmartListContainer } from '@smartsoft001/react';

const options: IListContainerOptions = { variant: 'card-dividers' };

const notifications = [
  { id: 'n1', text: 'Invoice #1042 was paid', time: '2 min ago' },
  { id: 'n2', text: 'Courtney Henry joined the team', time: '1 h ago' },
  { id: 'n3', text: 'Your export is ready to download', time: 'Yesterday' },
];

export function ListContainerUsageExample() {
  return (
    <SmartListContainer options={options}>
      {notifications.map((notification) => (
        <div key={notification.id} role="listitem">
          <p>{notification.text}</p>
          <small>{notification.time}</small>
        </div>
      ))}
    </SmartListContainer>
  );
}
// #endregion
