import { fireEvent, render, screen } from '@testing-library/react';

import { CardHeadingUsageExample } from './usage.example';

describe('docs-examples-react: CardHeadingUsageExample', () => {
  it('should render the title and description from the options', () => {
    render(<CardHeadingUsageExample />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Job postings' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Open roles across all teams/)).toBeInTheDocument();
  });

  it('should render the actions node and run its handler', () => {
    const { container } = render(<CardHeadingUsageExample />);

    fireEvent.click(
      container.querySelector('.actions button') as HTMLButtonElement,
    );

    expect(screen.getByText('Jobs created: 1')).toBeInTheDocument();
  });
});
