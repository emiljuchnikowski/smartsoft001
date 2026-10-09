import { fireEvent, render, screen } from '@testing-library/react';

import { FeedCustomExample } from './custom.example';

describe('docs-examples-react: FeedCustomExample', () => {
  it('should render the custom feed instead of the standard one', () => {
    const { container } = render(<FeedCustomExample />);

    expect(container.querySelector('.docs-feed')).not.toBeNull();
    expect(container.querySelector('.feed')).toBeNull();
    expect(container.querySelector('.docs-feed__title')).toHaveTextContent(
      'Application activity',
    );
  });

  it('should render only the first two events until the feed is expanded', () => {
    const { container } = render(<FeedCustomExample />);

    const events = container.querySelectorAll('.docs-feed__event');

    expect(events).toHaveLength(2);
    expect(events[0]).toHaveTextContent('Applied to Front End Developer');
  });

  it('should render every event after clicking "Show all"', () => {
    const { container } = render(<FeedCustomExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Show all' }));

    expect(container.querySelectorAll('.docs-feed__event')).toHaveLength(3);
    expect(container.querySelector('.docs-feed__more')).toBeNull();
  });
});
