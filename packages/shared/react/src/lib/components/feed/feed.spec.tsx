import { render, screen } from '@testing-library/react';

import { SmartFeed } from './feed';
import { SmartFeedProps } from './feed.types';
import { SmartFeedPreset } from './preset/feed-preset';
import { SmartFeedStandard } from './standard/feed-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartFeed', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartFeed />);

      expect(container.querySelector('.feed')).toBeInTheDocument();
    });

    it('should pass options and className to the standard implementation', () => {
      const { container } = render(
        <SmartFeed options={{ title: 'Activity' }} className="passed-class" />,
      );

      expect(container.firstElementChild).toHaveClass('passed-class');
      expect(container.querySelector('.feed > h3.title')).toHaveTextContent(
        'Activity',
      );
    });

    it('should render the implementation registered as components.feed', () => {
      const Custom = ({ options }: SmartFeedProps) => (
        <div data-testid="custom">{options?.title}</div>
      );

      const { container } = render(
        <SmartProvider components={{ feed: Custom }}>
          <SmartFeed options={{ title: 'Injected' }} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('Injected');
      expect(container.querySelector('.feed')).toBeNull();
    });
  });

  describe('standard', () => {
    it('should always render the wrapper', () => {
      const { container } = render(<SmartFeedStandard />);

      expect(container.querySelector('.feed')).toBeInTheDocument();
    });

    it('should not render the list when no events are provided', () => {
      const { container } = render(<SmartFeedStandard />);

      expect(container.querySelector('ol[role="list"]')).toBeNull();
    });

    it('should apply className on the outer element', () => {
      const { container } = render(
        <SmartFeedStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render the feed description', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{ title: 'Activity', description: 'Recent project events.' }}
        />,
      );

      expect(
        container.querySelector('.feed > p.description'),
      ).toHaveTextContent('Recent project events.');
    });

    it('should render one li.event per event', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{
            events: [
              { id: '1', title: 'Created invoice' },
              { id: '2', title: 'Sent invoice' },
              { id: '3', title: 'Paid invoice' },
            ],
          }}
        />,
      );

      expect(
        container.querySelectorAll('ol[role="list"] li.event'),
      ).toHaveLength(3);
    });

    it('should render the event title in span.title when there is no href', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{ events: [{ title: 'Created invoice' }] }}
        />,
      );

      expect(container.querySelector('li.event span.title')).toHaveTextContent(
        'Created invoice',
      );
    });

    it('should render the event title as a link when href is provided', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{
            events: [{ title: 'Created invoice', href: '/invoice/1' }],
          }}
        />,
      );

      expect(container.querySelector('li.event a.title')).toHaveAttribute(
        'href',
        '/invoice/1',
      );
    });

    it('should render the event description', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{ events: [{ title: 'Created', description: 'By Tom' }] }}
        />,
      );

      expect(
        container.querySelector('li.event .body p.description'),
      ).toHaveTextContent('By Tom');
    });

    it('should render time.timestamp when the event has a timestamp', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{
            events: [
              { title: 'Created invoice', timestamp: '2026-01-23T10:32' },
            ],
          }}
        />,
      );

      expect(
        container.querySelector('li.event time.timestamp'),
      ).toHaveTextContent('2026-01-23T10:32');
    });

    it('should render img.avatar when avatarUrl is provided without iconTpl', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{ events: [{ title: 'Comment', avatarUrl: '/img/u.jpg' }] }}
        />,
      );

      const img = container.querySelector('li.event img.avatar');

      expect(img).toHaveAttribute('src', '/img/u.jpg');
      expect(img).toHaveAttribute('alt', '');
    });

    it('should render iconTpl over avatarUrl when both are provided', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{
            events: [
              {
                title: 'Action',
                avatarUrl: '/img/u.jpg',
                iconTpl: <svg className="custom-icon" />,
              },
            ],
          }}
        />,
      );

      expect(
        container.querySelector('li.event span.icon svg.custom-icon'),
      ).toBeInTheDocument();
      expect(container.querySelector('li.event img.avatar')).toBeNull();
    });

    it('should render the comments under the event', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{
            events: [
              {
                title: 'Discussion',
                comments: [
                  { authorName: 'Lindsay', content: 'Looking good' },
                  {
                    authorName: 'Tom',
                    content: 'Approved',
                    timestamp: '3d ago',
                    authorAvatarUrl: '/img/tom.jpg',
                  },
                ],
              },
            ],
          }}
        />,
      );

      const comments = container.querySelectorAll(
        'li.event ul.comments[role="list"] li.comment',
      );

      expect(comments).toHaveLength(2);
      expect(comments[0].querySelector('.author')).toHaveTextContent('Lindsay');
      expect(comments[0].querySelector('.content')).toHaveTextContent(
        'Looking good',
      );
      expect(comments[1].querySelector('img.avatar')).toHaveAttribute(
        'src',
        '/img/tom.jpg',
      );
      expect(comments[1].querySelector('time.timestamp')).toHaveTextContent(
        '3d ago',
      );
    });

    it('should render emptyTpl when there are no events', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{
            events: [],
            emptyTpl: <p className="empty-msg">Brak aktywności</p>,
          }}
        />,
      );

      expect(container.querySelector('.empty p.empty-msg')).toBeInTheDocument();
    });

    it('should not render emptyTpl when there are events', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{
            events: [{ title: 'A' }],
            emptyTpl: <p className="empty-msg">Brak aktywności</p>,
          }}
        />,
      );

      expect(container.querySelector('.empty')).toBeNull();
    });

    it('should render commentSubmitTpl inside .comment-submit', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{ commentSubmitTpl: <form className="comment-form" /> }}
        />,
      );

      expect(
        container.querySelector('.comment-submit form.comment-form'),
      ).toBeInTheDocument();
    });

    it('should render footerTpl inside .footer', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{
            footerTpl: <button className="footer-btn">Load more</button>,
          }}
        />,
      );

      expect(
        container.querySelector('.footer button.footer-btn'),
      ).toBeInTheDocument();
    });

    it('should set aria-label on the li when event.ariaLabel is provided', () => {
      const { container } = render(
        <SmartFeedStandard
          options={{
            events: [{ title: 'Hello', ariaLabel: 'Greeting event' }],
          }}
        />,
      );

      expect(container.querySelector('li.event')).toHaveAttribute(
        'aria-label',
        'Greeting event',
      );
    });

    it('should not set aria-label on the li without event.ariaLabel', () => {
      const { container } = render(
        <SmartFeedStandard options={{ events: [{ title: 'Hello' }] }} />,
      );

      expect(container.querySelector('li.event')).not.toHaveAttribute(
        'aria-label',
      );
    });
  });
  describe('preset', () => {
    it('should render the feed title heading', () => {
      render(<SmartFeedPreset options={{ title: 'Activity' }} />);

      const heading = screen.getByRole('heading', { name: 'Activity' });

      expect(heading).toHaveClass('smart:uppercase');
      expect(heading.parentElement).toHaveClass('smart:ps-2');
    });

    it('should render the feed-level description', () => {
      render(<SmartFeedPreset options={{ description: 'Recent events' }} />);

      expect(screen.getByText('Recent events')).toHaveClass('smart:mt-1');
    });

    it('should render one row per event', () => {
      render(
        <SmartFeedPreset
          options={{ events: [{ title: 'First' }, { title: 'Second' }] }}
        />,
      );

      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    });

    it('should render a dot marker by default', () => {
      const { container } = render(
        <SmartFeedPreset options={{ events: [{ title: 'Event' }] }} />,
      );

      expect(container.querySelector('span[aria-hidden="true"]')).toHaveClass(
        'smart:rounded-full',
        'smart:size-2',
      );
    });

    it('should render an avatar marker when avatarUrl is set', () => {
      const { container } = render(
        <SmartFeedPreset
          options={{ events: [{ title: 'Event', avatarUrl: '/a.png' }] }}
        />,
      );

      const img = container.querySelector('img');

      expect(img).toHaveAttribute('src', '/a.png');
      expect(img).toHaveClass('smart:size-7');
      expect(container.querySelector('span[aria-hidden="true"]')).toBeNull();
    });

    it('should render the iconTpl marker over the avatar', () => {
      const { container } = render(
        <SmartFeedPreset
          options={{
            events: [
              {
                title: 'Event',
                avatarUrl: '/a.png',
                iconTpl: <svg data-testid="icon" />,
              },
            ],
          }}
        />,
      );

      expect(screen.getByTestId('icon').parentElement).toHaveClass(
        'smart:size-7',
        'smart:z-10',
      );
      expect(container.querySelector('img')).toBeNull();
    });

    it('should render the event title as a link when href is set', () => {
      render(
        <SmartFeedPreset
          options={{ events: [{ title: 'Linked', href: '/go' }] }}
        />,
      );

      const link = screen.getByRole('link', { name: 'Linked' });

      expect(link).toHaveAttribute('href', '/go');
      expect(link).toHaveClass('smart:hover:underline');
    });

    it('should render the event description', () => {
      render(
        <SmartFeedPreset
          options={{ events: [{ title: 'Event', description: 'Details' }] }}
        />,
      );

      expect(screen.getByText('Details')).toHaveClass('smart:mt-1');
    });

    it('should render a side timestamp when provided', () => {
      render(
        <SmartFeedPreset
          options={{ events: [{ title: 'Event', timestamp: '12:05PM' }] }}
        />,
      );

      expect(screen.getByText('12:05PM').parentElement).toHaveClass(
        'smart:min-w-14',
      );
    });

    it('should set aria-label on the row when ariaLabel is set', () => {
      render(
        <SmartFeedPreset
          options={{ events: [{ title: 'Event', ariaLabel: 'Row label' }] }}
        />,
      );

      expect(screen.getByLabelText('Row label')).toHaveClass('smart:flex');
    });

    it('should render comments with author name, content and timestamp', () => {
      const { container } = render(
        <SmartFeedPreset
          options={{
            events: [
              {
                title: 'Discussion',
                comments: [
                  {
                    authorName: 'Lindsay',
                    content: 'Looks good',
                    timestamp: '3d ago',
                    authorAvatarUrl: '/l.png',
                  },
                ],
              },
            ],
          }}
        />,
      );

      const button = screen.getByRole('button');

      expect(button).toHaveTextContent('Lindsay');
      expect(button.querySelector('img')).toHaveAttribute('src', '/l.png');
      expect(button.querySelector('time')).toHaveTextContent('3d ago');
      expect(container).toHaveTextContent('Looks good');
    });

    it('should render an initials fallback when a comment has no avatar', () => {
      render(
        <SmartFeedPreset
          options={{
            events: [
              {
                title: 'Discussion',
                comments: [{ authorName: 'tom', content: 'Hi' }],
              },
            ],
          }}
        />,
      );

      expect(
        screen.getByRole('button').querySelector('span'),
      ).toHaveTextContent(/^T$/);
    });

    it('should render the emptyTpl when there are no events', () => {
      render(
        <SmartFeedPreset
          options={{ emptyTpl: <p data-testid="empty">Nothing</p> }}
        />,
      );

      expect(screen.getByTestId('empty').parentElement).toHaveClass(
        'smart:py-4',
      );
    });

    it('should render the commentSubmitTpl and footerTpl slots', () => {
      render(
        <SmartFeedPreset
          options={{
            commentSubmitTpl: <form data-testid="submit" />,
            footerTpl: <a data-testid="footer">More</a>,
          }}
        />,
      );

      expect(screen.getByTestId('submit').parentElement).toHaveClass(
        'smart:mt-4',
      );
      expect(screen.getByTestId('footer').parentElement).toHaveClass(
        'smart:mt-4',
      );
    });

    it('should apply className on the root', () => {
      const { container } = render(
        <SmartFeedPreset className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:w-full',
        'my-extra-class',
      );
    });

    it('should render through SmartFeed when registered as "feed"', () => {
      const { container } = render(
        <SmartProvider components={{ feed: SmartFeedPreset }}>
          <SmartFeed options={{ title: 'Activity' }} className="wrap" />
        </SmartProvider>,
      );

      expect(container.firstElementChild).toHaveClass('smart:w-full', 'wrap');
      expect(container.querySelector('.feed')).toBeNull();
    });
  });
});
