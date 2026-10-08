import { render, screen } from '@testing-library/react';

import { SmartMediaObject } from './media-object';
import { SmartMediaObjectProps } from './media-object.types';
import { SmartMediaObjectPreset } from './preset/media-object-preset';
import {
  getMediaObjectBodyClasses,
  getMediaObjectMediaClasses,
  getMediaObjectRootClasses,
} from './preset/preset-classes';
import { SmartMediaObjectStandard } from './standard/media-object-standard';
import { SmartProvider } from '../../providers/smart-provider';

const MEDIA_URL = 'https://example.com/image.png';
const MEDIA_ALT = 'Example image';

describe('@smartsoft001/react: SmartMediaObject', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartMediaObject mediaUrl={MEDIA_URL} mediaAlt={MEDIA_ALT}>
          <span className="projected-body">Body content</span>
        </SmartMediaObject>,
      );

      expect(
        container.querySelector('.smart-media-object-body .projected-body'),
      ).toBeInTheDocument();
    });

    it('should pass mediaUrl, mediaAlt, options and className to the standard implementation', () => {
      const { container } = render(
        <SmartMediaObject
          mediaUrl={MEDIA_URL}
          mediaAlt={MEDIA_ALT}
          options={{ position: 'right' }}
          className="passed-class"
        />,
      );

      expect(screen.getByRole('img', { name: MEDIA_ALT })).toHaveAttribute(
        'src',
        MEDIA_URL,
      );
      expect(container.firstElementChild).toHaveClass('passed-class');
      expect(container.firstElementChild).toHaveAttribute(
        'data-position',
        'right',
      );
    });

    it('should render the implementation registered as components["media-object"]', () => {
      const Custom = ({ mediaAlt, children }: SmartMediaObjectProps) => (
        <div data-testid="custom">
          {mediaAlt}
          {children}
        </div>
      );

      const { container } = render(
        <SmartProvider components={{ 'media-object': Custom }}>
          <SmartMediaObject mediaUrl={MEDIA_URL} mediaAlt={MEDIA_ALT}>
            body
          </SmartMediaObject>
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent(
        'Example imagebody',
      );
      expect(container.querySelector('img')).toBeNull();
    });
  });

  describe('standard', () => {
    it('should render an img with mediaUrl and mediaAlt', () => {
      render(
        <SmartMediaObjectStandard mediaUrl={MEDIA_URL} mediaAlt={MEDIA_ALT} />,
      );

      const img = screen.getByRole('img', { name: MEDIA_ALT });

      expect(img).toHaveAttribute('src', MEDIA_URL);
    });

    it('should render children into the body slot', () => {
      const { container } = render(
        <SmartMediaObjectStandard mediaUrl={MEDIA_URL} mediaAlt={MEDIA_ALT}>
          <span className="projected-body">Body content</span>
        </SmartMediaObjectStandard>,
      );

      const body = container.querySelector('.smart-media-object-body');

      expect(body?.querySelector('.projected-body')).toBeInTheDocument();
      expect(body).toHaveTextContent('Body content');
    });

    it('should default data-position to "left" without options', () => {
      const { container } = render(
        <SmartMediaObjectStandard mediaUrl={MEDIA_URL} mediaAlt={MEDIA_ALT} />,
      );

      expect(container.firstElementChild).toHaveAttribute(
        'data-position',
        'left',
      );
    });

    it('should not set data-alignment without options', () => {
      const { container } = render(
        <SmartMediaObjectStandard mediaUrl={MEDIA_URL} mediaAlt={MEDIA_ALT} />,
      );

      expect(container.firstElementChild).not.toHaveAttribute('data-alignment');
    });

    it('should reflect options.position via data-position', () => {
      const { container } = render(
        <SmartMediaObjectStandard
          mediaUrl={MEDIA_URL}
          mediaAlt={MEDIA_ALT}
          options={{ position: 'right' }}
        />,
      );

      expect(container.firstElementChild).toHaveAttribute(
        'data-position',
        'right',
      );
    });

    it('should reflect options.alignment via data-alignment', () => {
      const { container } = render(
        <SmartMediaObjectStandard
          mediaUrl={MEDIA_URL}
          mediaAlt={MEDIA_ALT}
          options={{ alignment: 'center' }}
        />,
      );

      expect(container.firstElementChild).toHaveAttribute(
        'data-alignment',
        'center',
      );
    });

    it('should apply className on the wrapper div', () => {
      const { container } = render(
        <SmartMediaObjectStandard
          mediaUrl={MEDIA_URL}
          mediaAlt={MEDIA_ALT}
          className="my-extra-class"
        />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });
  describe('preset-classes', () => {
    it('should return the flex row base with gap-4 without options', () => {
      expect(getMediaObjectRootClasses(undefined)).toBe(
        'smart:flex smart:gap-4',
      );
    });

    it('should reverse the row when position is right', () => {
      expect(getMediaObjectRootClasses({ position: 'right' })).toContain(
        'smart:flex-row-reverse',
      );
    });

    it.each([
      ['top', 'smart:items-start'],
      ['center', 'smart:items-center'],
      ['bottom', 'smart:items-end'],
    ] as const)('should map alignment %s to %s', (alignment, expected) => {
      expect(getMediaObjectRootClasses({ alignment })).toContain(expected);
    });

    it('should not add an items-* class for the stretched alignment', () => {
      expect(getMediaObjectRootClasses({ alignment: 'stretched' })).not.toMatch(
        /smart:items-/,
      );
    });

    it('should fold to a column then a reversed row on sm when responsive and right', () => {
      const classes = getMediaObjectRootClasses({
        responsive: true,
        position: 'right',
      });

      expect(classes).toContain('smart:flex-col');
      expect(classes).toContain('smart:sm:flex-row-reverse');
    });

    it('should use a tighter gap and a top margin when nested', () => {
      const classes = getMediaObjectRootClasses({ nested: true });

      expect(classes).toContain('smart:gap-3');
      expect(classes).not.toContain('smart:gap-4');
      expect(classes).toContain('smart:mt-4');
    });

    it('should default the media to a rounded square that never shrinks', () => {
      expect(getMediaObjectMediaClasses(undefined)).toBe(
        'smart:rounded-lg smart:object-cover smart:shrink-0 smart:size-16',
      );
    });

    it('should widen the media when wide', () => {
      const classes = getMediaObjectMediaClasses({ wide: true });

      expect(classes).toContain('smart:w-32 smart:h-16');
      expect(classes).not.toContain('smart:size-16');
    });

    it('should stretch the wide media to fill the row', () => {
      expect(
        getMediaObjectMediaClasses({ alignment: 'stretched', wide: true }),
      ).toContain('smart:w-32 smart:self-stretch smart:h-auto');
    });

    it('should render the body as small muted text', () => {
      expect(getMediaObjectBodyClasses()).toBe(
        'smart:text-sm smart:text-gray-700 smart:dark:text-gray-300',
      );
    });
  });

  describe('preset', () => {
    function part(container: HTMLElement, role: string) {
      return container.querySelector(`[data-role="${role}"]`);
    }

    it('should render the root, media and body parts', () => {
      const { container } = render(
        <SmartMediaObjectPreset mediaUrl={MEDIA_URL} mediaAlt={MEDIA_ALT}>
          <span className="projected-body">Body content</span>
        </SmartMediaObjectPreset>,
      );

      expect(part(container, 'root')).toHaveClass('smart:flex', 'smart:gap-4');
      expect(part(container, 'media')).toHaveAttribute('src', MEDIA_URL);
      expect(part(container, 'media')).toHaveAttribute('alt', MEDIA_ALT);
      expect(part(container, 'body')).toContainElement(
        container.querySelector('.projected-body') as HTMLElement,
      );
    });

    it('should keep the standard body marker class next to the preset classes', () => {
      const { container } = render(
        <SmartMediaObjectPreset mediaUrl={MEDIA_URL} mediaAlt={MEDIA_ALT} />,
      );

      expect(part(container, 'body')).toHaveClass(
        'smart-media-object-body',
        'smart:text-sm',
      );
    });

    it('should merge className onto the root', () => {
      const { container } = render(
        <SmartMediaObjectPreset
          mediaUrl={MEDIA_URL}
          mediaAlt={MEDIA_ALT}
          className="my-extra-class"
        />,
      );

      expect(part(container, 'root')).toHaveClass(
        'my-extra-class',
        'smart:flex',
      );
    });

    it('should reflect options.position on the root', () => {
      const { container } = render(
        <SmartMediaObjectPreset
          mediaUrl={MEDIA_URL}
          mediaAlt={MEDIA_ALT}
          options={{ position: 'right' }}
        />,
      );

      const root = part(container, 'root');

      expect(root).toHaveAttribute('data-position', 'right');
      expect(root).toHaveClass('smart:flex-row-reverse');
    });

    it('should default data-position to left and omit data-alignment', () => {
      const { container } = render(
        <SmartMediaObjectPreset mediaUrl={MEDIA_URL} mediaAlt={MEDIA_ALT} />,
      );

      const root = part(container, 'root');

      expect(root).toHaveAttribute('data-position', 'left');
      expect(root).not.toHaveAttribute('data-alignment');
    });

    it('should reflect options.alignment on the root', () => {
      const { container } = render(
        <SmartMediaObjectPreset
          mediaUrl={MEDIA_URL}
          mediaAlt={MEDIA_ALT}
          options={{ alignment: 'center' }}
        />,
      );

      const root = part(container, 'root');

      expect(root).toHaveAttribute('data-alignment', 'center');
      expect(root).toHaveClass('smart:items-center');
    });

    it('should widen the media when options.wide is set', () => {
      const { container } = render(
        <SmartMediaObjectPreset
          mediaUrl={MEDIA_URL}
          mediaAlt={MEDIA_ALT}
          options={{ wide: true }}
        />,
      );

      expect(part(container, 'media')).toHaveClass('smart:w-32');
    });

    it('should fold the root responsively when options.responsive is set', () => {
      const { container } = render(
        <SmartMediaObjectPreset
          mediaUrl={MEDIA_URL}
          mediaAlt={MEDIA_ALT}
          options={{ responsive: true }}
        />,
      );

      expect(part(container, 'root')).toHaveClass(
        'smart:flex-col',
        'smart:sm:flex-row',
      );
    });

    it('should render through SmartMediaObject when registered as "media-object"', () => {
      const { container } = render(
        <SmartProvider components={{ 'media-object': SmartMediaObjectPreset }}>
          <SmartMediaObject
            mediaUrl={MEDIA_URL}
            mediaAlt={MEDIA_ALT}
            className="wrap"
          >
            Body
          </SmartMediaObject>
        </SmartProvider>,
      );

      expect(part(container, 'root')).toHaveClass('wrap', 'smart:flex');
      expect(part(container, 'body')).toHaveTextContent('Body');
    });
  });
});
