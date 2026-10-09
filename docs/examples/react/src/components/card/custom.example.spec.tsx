import { render, screen } from '@testing-library/react';

import { CardCustomExample, FlatCard } from './custom.example';

describe('docs-examples-react: CardCustomExample', () => {
  it('should render FlatCard through SmartCard instead of the standard card', () => {
    // Act
    const { container } = render(<CardCustomExample />);

    // Assert
    expect(container.querySelector('article.docs-card')).not.toBeNull();
    expect(
      screen.getByRole('heading', { name: 'Billing' }),
    ).toBeInTheDocument();
  });

  it('should pass the body and the footer on as bodyTpl and footerTpl', () => {
    // Act
    const { container } = render(<CardCustomExample />);

    // Assert
    expect(container.querySelector('.docs-card__body')).toHaveTextContent(
      'Pro plan, billed monthly.',
    );
    expect(container.querySelector('.docs-card__footer')).toHaveTextContent(
      'Next invoice on 1 May',
    );
  });

  it('should leave out the sections that have no content', () => {
    // Act
    const { container } = render(<FlatCard bodyTpl="Only a body" />);

    // Assert
    expect(container.querySelector('.docs-card__header')).toBeNull();
    expect(container.querySelector('.docs-card__footer')).toBeNull();
  });
});
