// #region usage
import { SmartColor, SmartLoader, SmartSize } from '@smartsoft001/react';

const size: SmartSize = 'lg';
const color: SmartColor = 'emerald';

// Pass `loading={false}` when the request finishes; the spinner disappears.
export function LoaderUsageExample({ loading = true }: { loading?: boolean }) {
  return <SmartLoader show={loading} size={size} color={color} />;
}
// #endregion
