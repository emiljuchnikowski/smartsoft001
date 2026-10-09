import { fireEvent, render, screen } from '@testing-library/react';

import { AccordionCustomExample, CustomAccordion } from './custom.example';

describe('docs-examples-react: AccordionCustomExample', () => {
  it('should render the custom accordion implementation with the header', () => {
    const { container } = render(<AccordionCustomExample />);

    const accordion = container.querySelector('.docs-accordion');
    expect(accordion).not.toBeNull();
    expect(accordion).toHaveTextContent('Switzerland');
  });

  it('should reveal the body when the custom header button is clicked', () => {
    const { container } = render(<AccordionCustomExample />);
    expect(container.querySelector('.docs-accordion__body')).toBeNull();

    fireEvent.click(screen.getByRole('button', { expanded: false }));

    expect(container.querySelector('.docs-accordion__body')).toHaveTextContent(
      'the flag is a big plus',
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('should ignore clicks while options.disabled', () => {
    const { container } = render(
      <CustomAccordion
        headerTpl="Header"
        bodyTpl="Body"
        options={{ disabled: true }}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(container.querySelector('.docs-accordion__body')).toBeNull();
  });
});
