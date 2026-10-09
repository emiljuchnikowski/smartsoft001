// #region usage
import { useState } from 'react';

import {
  cn,
  ISearchbarOptions,
  SmartProvider,
  SmartSearchbar,
  SmartSearchbarProps,
  useControlBinding,
  useSearchbar,
} from '@smartsoft001/react';

export function CustomSearchbar(props: SmartSearchbarProps) {
  const { options, className } = props;
  // useSearchbar owns the debounced control that feeds onTextChange and the
  // show / hide state; useControlBinding binds the input to that control.
  const { show, control, setShow, tryHide } = useSearchbar(props);
  const binding = useControlBinding(control);

  if (show) {
    return (
      <div className={cn('docs-searchbar', className)}>
        <span className="docs-searchbar__icon" aria-hidden="true">
          &#9906;
        </span>
        <input
          type="search"
          className="docs-searchbar__input"
          placeholder={options?.placeholder ?? 'Search'}
          aria-label={options?.label ?? 'Search'}
          value={binding.value ?? ''}
          onChange={(event) => binding.onChange(event.target.value)}
          onBlur={() => {
            binding.onBlur();
            tryHide();
          }}
        />
      </div>
    );
  }

  if (options?.showToggleButton) {
    return (
      <button
        type="button"
        className="docs-searchbar__toggle"
        aria-label="Show the search field"
        onClick={setShow}
      >
        &#9906;
      </button>
    );
  }

  return null;
}

// A module constant: a new object on every render would change the context.
const components = { searchbar: CustomSearchbar };

const options: ISearchbarOptions = {
  placeholder: 'Search invoices',
  label: 'Search invoices',
  debounceTime: 300,
  showToggleButton: true,
};

export function SearchbarCustomExample() {
  const [show, setShow] = useState(true);
  const [text, setText] = useState('');

  // Every SmartSearchbar below the provider renders CustomSearchbar, which
  // receives the same props, the change callbacks included.
  return (
    <SmartProvider components={components}>
      <SmartSearchbar
        options={options}
        show={show}
        onShowChange={setShow}
        text={text}
        onTextChange={setText}
      />
      {text && <p>{`Results for "${text}"`}</p>}
    </SmartProvider>
  );
}
// #endregion
