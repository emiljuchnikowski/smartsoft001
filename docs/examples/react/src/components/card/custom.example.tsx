// #region usage
import {
  ICardOptions,
  SmartCard,
  SmartCardVariantProps,
  SmartProvider,
  useCard,
} from '@smartsoft001/react';

/**
 * A card of your own: `useCard` decides which sections are shown, and the
 * wrapper hands `header` / `children` / `footer` over as `headerTpl` /
 * `bodyTpl` / `footerTpl`.
 */
export function FlatCard(props: SmartCardVariantProps) {
  const { options, className, headerTpl, bodyTpl, footerTpl } = props;
  const { showHeader, showFooter } = useCard(props);

  return (
    <article className={['docs-card', className].filter(Boolean).join(' ')}>
      {showHeader && (
        <header className="docs-card__header">
          {options?.title && <h3>{options.title}</h3>}
          {headerTpl}
        </header>
      )}
      <div className="docs-card__body">{bodyTpl}</div>
      {showFooter && <footer className="docs-card__footer">{footerTpl}</footer>}
    </article>
  );
}

// A module constant: a new object on every render would change the context.
const components = { card: FlatCard };

const options: ICardOptions = { title: 'Billing' };

// Every <SmartCard> below the provider renders FlatCard.
export function CardCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartCard
        options={options}
        hasHeader
        footer={<span>Next invoice on 1 May</span>}
      >
        <p>Pro plan, billed monthly.</p>
      </SmartCard>
    </SmartProvider>
  );
}
// #endregion
