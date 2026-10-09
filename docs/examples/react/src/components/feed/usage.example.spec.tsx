import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { FeedUsageExample } from './usage.example';

describe('docs-examples-react: FeedUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <FeedUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the title from the options', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Activity' }),
    ).toBeInTheDocument();
  });

  it('should render one entry per event from the options', () => {
    const { container } = setup();

    const events = container.querySelectorAll('li.event');

    expect(events).toHaveLength(3);
    expect(events[0]).toHaveTextContent('Applied to Front End Developer');
  });

  it('should render the comments of an event', () => {
    const { container } = setup();

    const comment = container.querySelector('li.comment');

    expect(comment).toHaveTextContent('Chelsea Hagon');
    expect(comment).toHaveTextContent('Looks great, approved.');
  });
});
