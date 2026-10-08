import { useCallback, useState } from 'react';

/**
 * The `[ngModel]="model"` + `(ngModelChange)` binding of the Angular date
 * filters: the editor shows what the user entered (the filter is read 500 ms
 * later) until the bound model changes, and then shows the model.
 */
export function useCrudFilterNgModel<T>(
  model: T,
  onModelChange: (value: T) => void,
): [T, (value: T) => void] {
  const [view, setView] = useState(model);
  const [prevModel, setPrevModel] = useState(model);
  let current = view;

  if (!Object.is(prevModel, model)) {
    setPrevModel(model);
    setView(model);
    current = model;
  }

  const onViewChange = useCallback(
    (value: T) => {
      setView(value);
      onModelChange(value);
    },
    [onModelChange],
  );

  return [current, onViewChange];
}
