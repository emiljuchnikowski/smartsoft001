import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';

import { SmartSignInFormProps } from './sign-in-form.types';

/**
 * The form logic every sign-in form variant shares: the typed email and
 * password, `submit()` reporting them with the mode, and `socialClick()`; both
 * are ignored while `disabled`.
 */
export function useSignInForm({
  mode = 'sign-in',
  disabled = false,
  onSubmit,
  onSocialClick,
}: SmartSignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Only the `onSubmit` callback leaves the component, not the native
      // submit event.
      event.stopPropagation();
      if (disabled) return;
      onSubmit?.({ email, password, mode });
    },
    [disabled, onSubmit, email, password, mode],
  );

  const socialClick = useCallback(
    (providerId: string) => {
      if (disabled) return;
      onSocialClick?.({ providerId, mode });
    },
    [disabled, onSocialClick, mode],
  );

  return { email, setEmail, password, setPassword, submit, socialClick };
}
