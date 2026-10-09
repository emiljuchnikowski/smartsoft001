import { act, fireEvent, screen } from '@testing-library/react';
import type { Root } from 'react-dom/client';

import { mount } from './main.example';

describe('docs-examples-react: mount', () => {
  let element: HTMLElement;
  let root: Root;

  beforeEach(async () => {
    element = document.createElement('div');
    document.body.appendChild(element);

    await act(async () => {
      root = mount(element);
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    element.remove();
    window.history.pushState(null, '', '/');
  });

  it('should render the application inside the element', () => {
    expect(element).toContainElement(screen.getByRole('button'));
  });

  it('should translate with the dictionary of the application', () => {
    expect(
      screen.getByRole('button', { name: 'Open notes' }),
    ).toBeInTheDocument();
  });

  it('should navigate through the history adapter of the provider', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Open notes' }));

    expect(window.location.pathname).toBe('/notes');
  });
});
