import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { TextareaUsageExample } from './usage.example';

describe('docs-examples-react: TextareaUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <TextareaUsageExample />
      </SmartProvider>,
    );

    return screen.getByRole('textbox') as HTMLTextAreaElement;
  }

  it('should render the textarea configured by the options', () => {
    const textarea = setup();

    expect(screen.getByText('Add your comment')).toBeInTheDocument();
    expect(textarea.rows).toBe(4);
    expect(textarea).toHaveAttribute('maxlength', '500');
    expect(textarea).toHaveAttribute('placeholder', 'Write a comment...');
    expect(textarea).toBeRequired();
  });

  it('should keep the typed text in the component state', () => {
    const textarea = setup();

    fireEvent.change(textarea, { target: { value: 'Looks good to me' } });

    expect(textarea).toHaveValue('Looks good to me');
  });

  it('should hand the text to the handler when the action is clicked', () => {
    const textarea = setup();
    fireEvent.change(textarea, { target: { value: 'Ship it' } });

    fireEvent.click(screen.getByRole('button', { name: 'Post' }));

    expect(screen.getByText('Posted: Ship it')).toBeInTheDocument();
  });
});
