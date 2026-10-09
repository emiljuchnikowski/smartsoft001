import { fireEvent, render, screen } from '@testing-library/react';

import { AccordionUsageExample } from './usage.example';

describe('docs-examples-react: AccordionUsageExample', () => {
  it('should render the header and keep the body collapsed', () => {
    render(<AccordionUsageExample />);

    expect(screen.getByText('What is your refund policy?')).toBeInTheDocument();
    expect(screen.queryByText(/within 30 days/)).not.toBeInTheDocument();
  });

  it('should expand the body when the header is clicked', () => {
    render(<AccordionUsageExample />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText(/within 30 days/)).toBeInTheDocument();
  });

  it('should collapse the body again on a second click', () => {
    render(<AccordionUsageExample />);
    const header = screen.getByRole('button');

    fireEvent.click(header);
    fireEvent.click(header);

    expect(screen.queryByText(/within 30 days/)).not.toBeInTheDocument();
  });
});
