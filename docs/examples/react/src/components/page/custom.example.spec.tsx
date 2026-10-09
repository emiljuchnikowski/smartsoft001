import { fireEvent, render, screen } from '@testing-library/react';

import { PageCustomExample } from './custom.example';

describe('docs-examples-react: PageCustomExample', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the custom page variant instead of the standard one', () => {
    const { container } = render(<PageCustomExample />);

    expect(container.querySelector('.docs-page')).not.toBeNull();
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('should render the title from the options', () => {
    render(<PageCustomExample />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Alice Johnson' }),
    ).toHaveClass('docs-page__title');
  });

  it('should render the children through the bodyTpl slot', () => {
    const { container } = render(<PageCustomExample />);

    expect(container.querySelector('.docs-page__body')).toHaveTextContent(
      'Account settings and permissions',
    );
  });

  it('should render the breadcrumbs slot', () => {
    render(<PageCustomExample />);

    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toHaveTextContent('Users');
  });

  it('should go back through the navigation adapter when the back button is clicked', () => {
    // Without a navigation adapter, SmartProvider drives window.history.
    const back = jest
      .spyOn(window.history, 'back')
      .mockImplementation(() => undefined);
    render(<PageCustomExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Go back' }));

    expect(back).toHaveBeenCalledTimes(1);
  });
});
