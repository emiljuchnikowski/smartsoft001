import { fireEvent, render, screen } from '@testing-library/react';

import { isInternalHref, SmartNavLink } from './nav-link';
import {
  createHistoryNavigation,
  ISmartLinkProps,
} from '../../providers/navigation';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartNavLink', () => {
  it.each([
    ['/team', true],
    ['team/members?x=1', true],
    ['https://example.com', false],
    ['mailto:hi@example.com', false],
    ['//cdn.example.com', false],
    ['#section', false],
  ])('should treat %s as internal: %s', (href, internal) => {
    expect(isInternalHref(href)).toBe(internal);
  });

  it('should render a plain anchor without a linkComponent', () => {
    render(<SmartNavLink href="/team">Team</SmartNavLink>);

    expect(screen.getByRole('link', { name: 'Team' })).toHaveAttribute(
      'href',
      '/team',
    );
  });

  it('should pass the link props and the extra attributes to the linkComponent', () => {
    const received: ISmartLinkProps[] = [];
    const Link = (props: ISmartLinkProps) => {
      received.push(props);

      return <a href={props.href}>{props.children}</a>;
    };
    const onClick = jest.fn();
    render(
      <SmartProvider
        navigation={{ ...createHistoryNavigation(), linkComponent: Link }}
      >
        <SmartNavLink
          href="/team"
          className="item"
          aria-current="page"
          role="tab"
          onClick={onClick}
        >
          Team
        </SmartNavLink>
      </SmartProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Team' }));

    expect(received[0]).toEqual(
      expect.objectContaining({
        href: '/team',
        className: 'item',
        'aria-current': 'page',
        role: 'tab',
        children: 'Team',
      }),
    );
    expect(received[0].onClick).toBe(onClick);
  });
});
