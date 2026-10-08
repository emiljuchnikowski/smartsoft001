import {
  act,
  createEvent,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import {
  SmartRichTextEditor,
  SmartRichTextEditorProps,
} from './rich-text-editor';

function setup(props: Partial<SmartRichTextEditorProps> = {}) {
  const onChange = jest.fn();
  const onBlur = jest.fn();
  const view = (extra: Partial<SmartRichTextEditorProps> = {}) => (
    <>
      <span id="body-label">Body</span>
      <SmartRichTextEditor
        labelledBy="body-label"
        placeholder="write here..."
        onChange={onChange}
        onBlur={onBlur}
        {...props}
        {...extra}
      />
    </>
  );
  const result = render(view());
  const editor = screen.getByRole('textbox', { name: 'Body' });

  return {
    editor,
    onChange,
    onBlur,
    rerender: (extra: Partial<SmartRichTextEditorProps>) =>
      result.rerender(view(extra)),
  };
}

/** Selects the content of `node` and lets the editor see the change. */
async function select(node: Node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  const selection = document.getSelection() as Selection;
  selection.removeAllRanges();
  selection.addRange(range);

  // jsdom fires `selectionchange` asynchronously, as browsers do.
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

function mockDocumentMethod(
  name: 'execCommand' | 'queryCommandState',
): jest.Mock {
  const mock: jest.Mock = jest.fn(() => true);
  Object.defineProperty(document, name, {
    value: mock,
    configurable: true,
    writable: true,
  });

  return mock;
}

const button = (name: string) => screen.getByRole('button', { name });

describe('@smartsoft001/react: SmartRichTextEditor', () => {
  let execCommand: jest.Mock;

  beforeEach(() => {
    execCommand = mockDocumentMethod('execCommand');
  });

  afterEach(() => {
    delete (document as { execCommand?: unknown }).execCommand;
    delete (document as { queryCommandState?: unknown }).queryCommandState;
  });

  describe('editing', () => {
    it('should render an editable multiline textbox', () => {
      const { editor } = setup();

      expect(editor).toHaveAttribute('contenteditable', 'true');
      expect(editor).toHaveAttribute('aria-multiline', 'true');
    });

    it('should render the sanitised HTML of the value', () => {
      const { editor } = setup({
        value: '<p>Hi <b>there</b><script>alert(1)</script></p>',
      });

      expect(editor.innerHTML).toBe('<p>Hi <b>there</b></p>');
    });

    it('should emit the HTML of the content on input', () => {
      const { editor, onChange } = setup();

      editor.innerHTML = '<p>Hello</p>';
      fireEvent.input(editor);

      expect(onChange).toHaveBeenCalledWith('<p>Hello</p>');
    });

    it('should not emit an unchanged content twice', () => {
      const { editor, onChange } = setup();

      editor.innerHTML = '<p>Hello</p>';
      fireEvent.input(editor);
      fireEvent.input(editor);

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur when the content loses focus', () => {
      const { editor, onBlur } = setup();

      fireEvent.blur(editor);

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should replace the content with a value set from outside', () => {
      const { editor, rerender } = setup({ value: '<p>Old</p>' });

      rerender({ value: '<p>New<img src="x" onerror="alert(1)"></p>' });

      expect(editor.innerHTML).toBe('<p>New<img src="x"></p>');
    });

    it('should not reset the content to the value it emitted', () => {
      const { editor, onChange, rerender } = setup();

      editor.innerHTML = '<p style="color: red;">Typed</p>';
      fireEvent.input(editor);
      rerender({ value: onChange.mock.calls[0][0] });

      expect(editor.innerHTML).toBe('<p style="color: red;">Typed</p>');
    });

    it('should show the placeholder while the content is empty', () => {
      setup({ value: '' });

      expect(screen.getByText('write here...')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });

    it('should expose the placeholder to assistive technology', () => {
      const { editor } = setup();

      expect(editor).toHaveAttribute('aria-placeholder', 'write here...');
    });

    it('should hide the placeholder once there is text', () => {
      const { editor } = setup({ value: '' });

      editor.innerHTML = '<p>Hello</p>';
      fireEvent.input(editor);

      expect(screen.queryByText('write here...')).not.toBeInTheDocument();
    });

    it('should not show the placeholder over an image', () => {
      setup({ value: '<p><img src="x.png"></p>' });

      expect(screen.queryByText('write here...')).not.toBeInTheDocument();
    });

    it('should make a disabled editor read-only', () => {
      const { editor } = setup({ disabled: true });

      expect(editor).toHaveAttribute('contenteditable', 'false');
      expect(editor).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('menu', () => {
    it('should render the menu of the Angular field, in order', () => {
      setup();

      expect(
        screen
          .getAllByRole('button')
          .map((item) => item.getAttribute('aria-label')),
      ).toEqual([
        'Bold',
        'Italic',
        'Underline',
        'Strike',
        'Code',
        'Blockquote',
        'Ordered List',
        'Bullet List',
        'Heading',
        'Insert Link',
        'Insert Image',
        'Text Color',
        'Background Color',
        'Left Align',
        'Center Align',
        'Right Align',
        'Justify',
      ]);
    });

    it('should separate the groups of the menu', () => {
      setup();

      expect(screen.getAllByRole('separator')).toHaveLength(7);
    });

    it('should title the icon buttons', () => {
      setup();

      expect(button('Bold')).toHaveAttribute('title', 'Bold');
    });

    it.each([
      ['Bold', 'bold'],
      ['Italic', 'italic'],
      ['Underline', 'underline'],
      ['Strike', 'strikeThrough'],
      ['Ordered List', 'insertOrderedList'],
      ['Bullet List', 'insertUnorderedList'],
      ['Left Align', 'justifyLeft'],
      ['Center Align', 'justifyCenter'],
      ['Right Align', 'justifyRight'],
      ['Justify', 'justifyFull'],
    ])('should run %s as the %s command', (label, command) => {
      setup();

      fireEvent.click(button(label));

      expect(execCommand).toHaveBeenCalledWith(command, false, undefined);
    });

    it('should emit the content changed by a command', () => {
      const { editor, onChange } = setup({ value: '<p>Hi</p>' });
      execCommand.mockImplementation(() => {
        editor.innerHTML = '<p><b>Hi</b></p>';

        return true;
      });

      fireEvent.click(button('Bold'));

      expect(onChange).toHaveBeenCalledWith('<p><b>Hi</b></p>');
    });

    it('should keep the focus in the editor when a button is pressed', () => {
      setup();
      const mouseDown = createEvent.mouseDown(button('Bold'));

      fireEvent(button('Bold'), mouseDown);

      expect(mouseDown.defaultPrevented).toBe(true);
    });

    it('should run a command on the last selection of the editor', async () => {
      const { editor } = setup({ value: '<p>Hello</p>' });
      let selected = '';
      execCommand.mockImplementation(() => {
        selected = String(document.getSelection());

        return true;
      });
      await select(editor.querySelector('p') as Node);
      await select(screen.getByText('Body'));

      fireEvent.click(button('Bold'));

      expect(selected).toBe('Hello');
    });

    it('should press the buttons of the formats at the selection', async () => {
      const queryCommandState = mockDocumentMethod('queryCommandState');
      queryCommandState.mockImplementation(
        (command: string) => command === 'bold',
      );
      const { editor } = setup({ value: '<p><b>Hello</b></p>' });

      await select(editor.querySelector('b') as Node);

      expect(button('Bold')).toHaveAttribute('aria-pressed', 'true');
      expect(button('Italic')).toHaveAttribute('aria-pressed', 'false');
    });

    it('should disable the menu of a disabled editor', () => {
      setup({ disabled: true });

      expect(button('Bold')).toBeDisabled();
      expect(button('Heading')).toBeDisabled();
      expect(button('Insert Link')).toBeDisabled();
    });
  });

  describe('code', () => {
    it('should wrap the selected text in code', async () => {
      const { editor } = setup({ value: '<p>a &lt; b</p>' });
      await select(editor.querySelector('p') as Node);

      fireEvent.click(button('Code'));

      expect(execCommand).toHaveBeenCalledWith(
        'insertHTML',
        false,
        '<code>a &lt; b</code>',
      );
    });

    it('should not insert code without selected text', async () => {
      const { editor } = setup({ value: '<p>Hello</p>' });
      await select(editor.querySelector('p') as Node);
      document.getSelection()?.collapseToStart();

      fireEvent.click(button('Code'));

      expect(execCommand).not.toHaveBeenCalledWith(
        'insertHTML',
        expect.anything(),
        expect.anything(),
      );
    });

    it('should press Code inside code', async () => {
      const { editor } = setup({ value: '<p>x <code>y</code></p>' });

      await select(editor.querySelector('code') as Node);

      expect(button('Code')).toHaveAttribute('aria-pressed', 'true');
    });

    it('should unwrap the code at the selection', async () => {
      const { editor, onChange } = setup({ value: '<p>x <code>y</code></p>' });
      await select(editor.querySelector('code') as Node);

      fireEvent.click(button('Code'));

      expect(editor.innerHTML).toBe('<p>x y</p>');
      expect(onChange).toHaveBeenCalledWith('<p>x y</p>');
    });
  });

  describe('blockquote', () => {
    it('should quote the block at the selection', () => {
      setup();

      fireEvent.click(button('Blockquote'));

      expect(execCommand).toHaveBeenCalledWith(
        'formatBlock',
        false,
        'blockquote',
      );
    });

    it('should press Blockquote inside a quote', async () => {
      const { editor } = setup({ value: '<blockquote><p>Q</p></blockquote>' });

      await select(editor.querySelector('p') as Node);

      expect(button('Blockquote')).toHaveAttribute('aria-pressed', 'true');
    });

    it('should lift the blocks out of a quote', async () => {
      const { editor } = setup({
        value: '<blockquote><p>A</p><p>B</p></blockquote>',
      });
      await select(editor.querySelector('p') as Node);

      fireEvent.click(button('Blockquote'));

      expect(editor.innerHTML).toBe('<p>A</p><p>B</p>');
    });

    it('should turn a quote of text into a paragraph', async () => {
      const { editor } = setup({ value: '<blockquote>Q</blockquote>' });
      await select(editor.querySelector('blockquote') as Node);

      fireEvent.click(button('Blockquote'));

      expect(editor.innerHTML).toBe('<p>Q</p>');
    });
  });

  describe('heading', () => {
    it('should list the headings in a listbox', () => {
      setup();

      fireEvent.click(button('Heading'));

      expect(button('Heading')).toHaveAttribute('aria-expanded', 'true');
      expect(
        screen.getAllByRole('option').map((option) => option.textContent),
      ).toEqual([
        'Header 1',
        'Header 2',
        'Header 3',
        'Header 4',
        'Header 5',
        'Header 6',
      ]);
    });

    it('should turn the block into the chosen heading', () => {
      setup();
      fireEvent.click(button('Heading'));

      fireEvent.click(screen.getByRole('option', { name: 'Header 2' }));

      expect(execCommand).toHaveBeenCalledWith('formatBlock', false, 'h2');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should name the dropdown after the heading at the selection', async () => {
      const { editor } = setup({ value: '<h3>Title</h3>' });

      await select(editor.querySelector('h3') as Node);
      fireEvent.click(button('Header 3'));

      expect(screen.getByRole('option', { name: 'Header 3' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('should turn the active heading back into a paragraph', async () => {
      const { editor } = setup({ value: '<h3>Title</h3>' });
      await select(editor.querySelector('h3') as Node);
      fireEvent.click(button('Header 3'));

      fireEvent.click(screen.getByRole('option', { name: 'Header 3' }));

      expect(execCommand).toHaveBeenCalledWith('formatBlock', false, 'p');
    });
  });

  describe('link', () => {
    const field = (name: string) => screen.getByLabelText(name);

    it('should open the link form', () => {
      setup();

      fireEvent.click(button('Insert Link'));

      expect(button('Insert Link')).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('dialog', { name: 'Insert Link' })).toBeVisible();
      expect(field('URL')).toHaveAttribute('type', 'url');
      expect(field('Open in new tab')).toBeChecked();
      expect(button('Insert')).toBeDisabled();
    });

    it('should prefill and lock the text with the selected text', async () => {
      const { editor } = setup({ value: '<p>Hello</p>' });
      await select(editor.querySelector('p') as Node);

      fireEvent.click(button('Insert Link'));

      expect(field('Text')).toHaveValue('Hello');
      expect(field('Text')).toBeDisabled();
    });

    it('should insert a link opening in a new tab', () => {
      setup();
      fireEvent.click(button('Insert Link'));
      fireEvent.change(field('URL'), {
        target: { value: 'https://example.com/?a=1&b="2"' },
      });
      fireEvent.change(field('Text'), { target: { value: '<Example>' } });

      fireEvent.click(button('Insert'));

      expect(execCommand).toHaveBeenCalledWith(
        'insertHTML',
        false,
        '<a href="https://example.com/?a=1&amp;b=&quot;2&quot;" title="https://example.com/?a=1&amp;b=&quot;2&quot;" target="_blank">&lt;Example&gt;</a>',
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should insert a link opening in the same tab', () => {
      setup();
      fireEvent.click(button('Insert Link'));
      fireEvent.change(field('URL'), { target: { value: 'example.com' } });
      fireEvent.change(field('Text'), { target: { value: 'Example' } });
      fireEvent.click(field('Open in new tab'));

      fireEvent.click(button('Insert'));

      expect(execCommand).toHaveBeenCalledWith(
        'insertHTML',
        false,
        '<a href="example.com" title="example.com" target="_self">Example</a>',
      );
    });

    it('should insert the link on Enter', () => {
      setup();
      fireEvent.click(button('Insert Link'));
      fireEvent.change(field('URL'), { target: { value: 'example.com' } });
      fireEvent.change(field('Text'), { target: { value: 'Example' } });

      fireEvent.keyDown(field('Text'), { key: 'Enter' });

      expect(execCommand).toHaveBeenCalledWith(
        'insertHTML',
        false,
        expect.stringContaining('<a href="example.com"'),
      );
    });

    it('should accept a mailto link', () => {
      setup();
      fireEvent.click(button('Insert Link'));

      fireEvent.change(field('URL'), {
        target: { value: 'mailto:ada@example.com' },
      });
      fireEvent.change(field('Text'), { target: { value: 'Ada' } });

      expect(button('Insert')).toBeEnabled();
    });

    it.each(['not a url', 'javascript:alert(document.cookie)'])(
      'should reject %s',
      (url) => {
        setup();
        fireEvent.click(button('Insert Link'));
        fireEvent.change(field('Text'), { target: { value: 'Text' } });

        fireEvent.change(field('URL'), { target: { value: url } });
        fireEvent.blur(field('URL'));

        expect(button('Insert')).toBeDisabled();
        expect(screen.getByText('Please enter a valid URL')).toBeVisible();
      },
    );

    it('should require the text', () => {
      setup();
      fireEvent.click(button('Insert Link'));

      fireEvent.blur(field('Text'));

      expect(screen.getByText('This is required')).toBeVisible();
    });

    it('should remove the link at the selection', async () => {
      const { editor, onChange } = setup({
        value: '<p><a href="https://x.com">X</a></p>',
      });
      await select(editor.querySelector('a') as Node);

      fireEvent.click(button('Remove Link'));

      expect(editor.innerHTML).toBe('<p>X</p>');
      expect(onChange).toHaveBeenCalledWith('<p>X</p>');
    });
  });

  describe('image', () => {
    const field = (name: string) => screen.getByLabelText(name);

    it('should open the image form', () => {
      setup();

      fireEvent.click(button('Insert Image'));

      expect(field('URL')).toHaveAttribute('type', 'url');
      expect(field('Alt Text')).toHaveValue('');
      expect(field('Title')).toHaveValue('');
      expect(button('Insert')).toBeDisabled();
    });

    it('should insert an image', () => {
      setup();
      fireEvent.click(button('Insert Image'));
      fireEvent.change(field('URL'), {
        target: { value: 'https://example.com/a.png' },
      });
      fireEvent.change(field('Alt Text'), { target: { value: 'A "cat"' } });
      fireEvent.change(field('Title'), { target: { value: 'Cat' } });

      fireEvent.click(button('Insert'));

      expect(execCommand).toHaveBeenCalledWith(
        'insertHTML',
        false,
        '<img src="https://example.com/a.png" alt="A &quot;cat&quot;" title="Cat">',
      );
    });

    it('should reject a mailto image', () => {
      setup();
      fireEvent.click(button('Insert Image'));

      fireEvent.change(field('URL'), {
        target: { value: 'mailto:ada@example.com' },
      });

      expect(button('Insert')).toBeDisabled();
    });
  });

  describe('colors', () => {
    it.each(['Text Color', 'Background Color'])(
      'should offer the color presets for %s in rows of 8',
      (label) => {
        setup();

        fireEvent.click(button(label));

        const dialog = screen.getByRole('dialog', { name: label });
        expect(dialog.children[0].children).toHaveLength(8);
        expect(screen.getAllByTitle(/^#/)).toHaveLength(16);
      },
    );

    it('should write the presets in a contrasting color', () => {
      setup();

      fireEvent.click(button('Text Color'));

      expect(screen.getByTitle('#0052cc').style.color).toBe('white');
      expect(screen.getByTitle('#fef2c0').style.color).toBe('black');
    });

    it('should color the selected text', () => {
      setup();
      fireEvent.click(button('Text Color'));

      fireEvent.click(screen.getByTitle('#b60205'));

      expect(execCommand).toHaveBeenCalledWith('foreColor', false, '#b60205');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should highlight the selected text', () => {
      setup();
      fireEvent.click(button('Background Color'));

      fireEvent.click(screen.getByTitle('#fbca04'));

      expect(execCommand).toHaveBeenCalledWith('hiliteColor', false, '#fbca04');
    });

    it('should highlight with backColor where hiliteColor is missing', () => {
      execCommand.mockImplementation(
        (command: string) => command !== 'hiliteColor',
      );
      setup();
      fireEvent.click(button('Background Color'));

      fireEvent.click(screen.getByTitle('#fbca04'));

      expect(execCommand).toHaveBeenCalledWith('backColor', false, '#fbca04');
    });

    it('should not offer to remove a color the selection does not have', () => {
      setup();

      fireEvent.click(button('Text Color'));

      expect(button('Remove')).toBeDisabled();
    });

    it('should check the color of the selection', async () => {
      const { editor } = setup({
        value: '<p><font color="#b60205">R</font></p>',
      });
      await select(editor.querySelector('font') as Node);

      fireEvent.click(button('Text Color'));

      expect(screen.getByTitle('#b60205')).toHaveTextContent('✔');
      expect(screen.getByTitle('#d93f0b')).toHaveTextContent('');
    });

    it.each([
      [
        'Text Color',
        '<p><span style="color: rgb(182, 2, 5);">R</span></p>',
        '<p>R</p>',
      ],
      ['Text Color', '<p><font color="#b60205">R</font></p>', '<p>R</p>'],
      [
        'Background Color',
        '<p><span style="background-color: rgb(251, 202, 4);">R</span></p>',
        '<p>R</p>',
      ],
      [
        'Text Color',
        '<p><b style="color: rgb(182, 2, 5); background-color: rgb(251, 202, 4);">R</b></p>',
        '<p><b style="background-color: rgb(251, 202, 4);">R</b></p>',
      ],
    ])('should remove the %s of %s', async (label, html, expected) => {
      const { editor, onChange } = setup();
      // The markup the colour commands leave in the session (a loaded value
      // is sanitised: its inline styles are gone).
      editor.innerHTML = html;
      fireEvent.input(editor);
      await select(editor.querySelector('p > *') as Node);
      fireEvent.click(button(label));

      fireEvent.click(button('Remove'));

      expect(editor.innerHTML).toBe(expected);
      expect(onChange).toHaveBeenCalledWith(expected);
    });
  });

  describe('popups', () => {
    it('should close a popup on a click outside it', () => {
      setup();
      fireEvent.click(button('Insert Link'));

      fireEvent.mouseDown(document.body);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should keep a popup open on a click inside it', () => {
      setup();
      fireEvent.click(button('Insert Link'));

      fireEvent.mouseDown(screen.getByLabelText('URL'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should close a popup with its button', () => {
      setup();
      fireEvent.click(button('Insert Image'));

      fireEvent.mouseDown(button('Insert Image'));
      fireEvent.click(button('Insert Image'));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should open one popup at a time', () => {
      setup();
      fireEvent.click(button('Insert Link'));

      fireEvent.mouseDown(button('Heading'));
      fireEvent.click(button('Heading'));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });
});
