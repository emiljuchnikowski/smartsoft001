// #region usage
import { useState } from 'react';

import {
  ITextareaActionClick,
  ITextareaOptions,
  SmartTextarea,
} from '@smartsoft001/react';

const options: ITextareaOptions = {
  label: 'Add your comment',
  name: 'comment',
  rows: 4,
  maxLength: 500,
  required: true,
  actions: [{ id: 'post', label: 'Post', variant: 'primary' }],
};

export function TextareaUsageExample() {
  const [comment, setComment] = useState('');
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null);

  const onActionClick = ({ value }: ITextareaActionClick) =>
    setLastSubmitted(value);

  return (
    <>
      <SmartTextarea
        options={options}
        value={comment}
        onValueChange={setComment}
        placeholder="Write a comment..."
        onActionClick={onActionClick}
      />
      {lastSubmitted !== null && <p>Posted: {lastSubmitted}</p>}
    </>
  );
}
// #endregion
