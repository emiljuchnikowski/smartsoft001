// #region usage
import {
  IMediaObjectOptions,
  SmartMediaObject,
  SmartMediaObjectProps,
  SmartProvider,
} from '@smartsoft001/react';

/**
 * A custom media object: it receives the props of `SmartMediaObject`
 * (`mediaUrl`, `mediaAlt`, `options`, `className` and the body as `children`)
 * and owns the markup around them.
 */
export function CustomMediaObject({
  mediaUrl,
  mediaAlt,
  options,
  className,
  children,
}: SmartMediaObjectProps) {
  const classes = [
    'docs-media-object',
    options?.wide && 'docs-media-object--wide',
    options?.nested && 'docs-media-object--nested',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      className={classes}
      data-alignment={options?.alignment ?? 'top'}
      data-position={options?.position ?? 'left'}
    >
      <img
        className="docs-media-object__media"
        src={mediaUrl}
        alt={mediaAlt}
        width={64}
        height={64}
      />
      <div className="docs-media-object__body">{children}</div>
    </article>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'media-object': CustomMediaObject };

const mediaUrl =
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

const options: IMediaObjectOptions = {
  alignment: 'center',
  position: 'right',
};

/**
 * Every `SmartMediaObject` below this provider renders `CustomMediaObject`
 * instead of the standard rendering.
 */
export function MediaObjectCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartMediaObject
        mediaUrl={mediaUrl}
        mediaAlt="Portrait of Lindsay Walton"
        options={options}
        className="docs-media-object--demo"
      >
        <h3 className="docs-media-object__title">Lindsay Walton</h3>
        <p className="docs-media-object__text">
          Front-end developer, joined the design systems team in March.
        </p>
      </SmartMediaObject>
    </SmartProvider>
  );
}
// #endregion
