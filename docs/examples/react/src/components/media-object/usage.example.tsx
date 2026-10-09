// #region usage
import { IMediaObjectOptions, SmartMediaObject } from '@smartsoft001/react';

const avatarUrl = 'https://i.pravatar.cc/128?u=lindsay.walton';

const options: IMediaObjectOptions = {
  alignment: 'center',
};

export function MediaObjectUsageExample() {
  return (
    <SmartMediaObject
      mediaUrl={avatarUrl}
      mediaAlt="Portrait of Lindsay Walton"
      options={options}
    >
      <h4>Lindsay Walton</h4>
      <p>Joined the design systems team in March.</p>
    </SmartMediaObject>
  );
}
// #endregion
