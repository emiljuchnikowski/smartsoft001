import { fireEvent, render, screen } from '@testing-library/react';

import { ISmartNavigation, SmartProvider } from '@smartsoft001/react';

import { PageUsageExample } from './usage.example';

describe('docs-examples-react: PageUsageExample', () => {
  function setup() {
    // An application passes the adapter of its router once, at the root.
    const navigation: ISmartNavigation = {
      navigate: jest.fn(),
      back: jest.fn(),
      getCurrentUrl: () => '/team',
      subscribe: () => () => undefined,
    };

    render(
      <SmartProvider language="eng" navigation={navigation}>
        <PageUsageExample />
      </SmartProvider>,
    );

    return navigation;
  }

  it('should render the title from the options', () => {
    setup();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Team members' }),
    ).toBeInTheDocument();
  });

  it('should render the children as the body', () => {
    setup();

    expect(
      screen.getByText('12 people have access to this workspace.'),
    ).toBeInTheDocument();
  });

  it('should keep the typed search text in the state', () => {
    setup();
    const search = screen.getByRole('textbox');

    fireEvent.change(search, { target: { value: 'alice' } });

    expect(search).toHaveValue('alice');
  });

  it('should navigate back when the back button is clicked', () => {
    const navigation = setup();

    fireEvent.click(screen.getByRole('button'));

    expect(navigation.back).toHaveBeenCalledTimes(1);
  });
});
