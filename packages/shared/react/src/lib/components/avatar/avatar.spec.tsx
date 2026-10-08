import { render, screen } from '@testing-library/react';

import { SmartAvatar } from './avatar';
import { SmartAvatarProps } from './avatar.types';
import { SmartAvatarPreset } from './preset/avatar-preset';
import { SmartAvatarStandard } from './standard/avatar-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartAvatar', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartAvatar initials="AB" size="lg" />);

      expect(container.firstElementChild).toHaveAttribute('data-size', 'lg');
      expect(
        container.querySelector('.smart-avatar-initials'),
      ).toHaveTextContent('AB');
    });

    it('should render the implementation registered as components.avatar', () => {
      const Custom = (props: SmartAvatarProps) => (
        <div data-testid="custom">
          {props.initials} {props.shape} {props.className}
        </div>
      );
      render(
        <SmartProvider components={{ avatar: Custom }}>
          <SmartAvatar initials="AB" shape="rounded" className="passed" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent(
        'AB rounded passed',
      );
    });
  });

  describe('standard', () => {
    it('should render an image with the imageUrl', () => {
      const { container } = render(
        <SmartAvatarStandard imageUrl="https://example.com/avatar.png" />,
      );

      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        'https://example.com/avatar.png',
      );
    });

    it('should render the initials when there is no imageUrl', () => {
      const { container } = render(<SmartAvatarStandard initials="AB" />);

      expect(
        container.querySelector('.smart-avatar-initials'),
      ).toHaveTextContent('AB');
    });

    it('should render a hidden placeholder without imageUrl and initials', () => {
      const { container } = render(<SmartAvatarStandard />);

      expect(
        container.querySelector('.smart-avatar-placeholder'),
      ).toHaveAttribute('aria-hidden', 'true');
    });

    it('should keep the placeholder when placeholderType is initials but no initials are set', () => {
      const { container } = render(
        <SmartAvatarStandard options={{ placeholderType: 'initials' }} />,
      );

      expect(
        container.querySelector('.smart-avatar-placeholder'),
      ).toBeInTheDocument();
    });

    it('should render one group item per group entry', () => {
      const { container } = render(
        <SmartAvatarStandard
          group={[
            { id: '1', initials: 'AB' },
            { id: '2', imageUrl: 'https://example.com/2.png' },
            { id: '3', initials: 'CD' },
          ]}
        />,
      );

      expect(
        container.querySelectorAll('.smart-avatar-group-item'),
      ).toHaveLength(3);
    });

    it('should render the image of a group item that has one', () => {
      const { container } = render(
        <SmartAvatarStandard
          group={[{ id: '2', imageUrl: 'https://example.com/2.png' }]}
        />,
      );

      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        'https://example.com/2.png',
      );
    });

    it('should not render a group for an empty group array', () => {
      const { container } = render(
        <SmartAvatarStandard group={[]} initials="AB" />,
      );

      expect(container.querySelector('.smart-avatar-group-item')).toBeNull();
    });

    it('should expose size, shape and placeholder type defaults as data attributes', () => {
      const { container } = render(<SmartAvatarStandard />);

      const avatar = container.firstElementChild;
      expect(avatar).toHaveAttribute('data-size', 'md');
      expect(avatar).toHaveAttribute('data-shape', 'circle');
      expect(avatar).toHaveAttribute('data-placeholder-type', 'icon');
    });

    it('should reflect size, shape and placeholder type in the data attributes', () => {
      const { container } = render(
        <SmartAvatarStandard
          size="lg"
          shape="rounded"
          options={{ placeholderType: 'initials' }}
        />,
      );

      const avatar = container.firstElementChild;
      expect(avatar).toHaveAttribute('data-size', 'lg');
      expect(avatar).toHaveAttribute('data-shape', 'rounded');
      expect(avatar).toHaveAttribute('data-placeholder-type', 'initials');
    });

    it('should expose data-stack-direction="top-to-bottom" on a group by default', () => {
      const { container } = render(
        <SmartAvatarStandard group={[{ id: '1', initials: 'AB' }]} />,
      );

      expect(container.firstElementChild).toHaveAttribute(
        'data-stack-direction',
        'top-to-bottom',
      );
    });

    it('should reflect options.stackDirection on a group', () => {
      const { container } = render(
        <SmartAvatarStandard
          group={[{ id: '1', initials: 'AB' }]}
          options={{ stackDirection: 'bottom-to-top' }}
        />,
      );

      expect(container.firstElementChild).toHaveAttribute(
        'data-stack-direction',
        'bottom-to-top',
      );
    });

    it('should not expose data-stack-direction outside a group', () => {
      const { container } = render(<SmartAvatarStandard />);

      expect(container.firstElementChild).not.toHaveAttribute(
        'data-stack-direction',
      );
    });

    it('should apply className on the root span', () => {
      const { container } = render(
        <SmartAvatarStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    const url = 'https://example.com/a.png';

    it('should render an image with the default size and circle classes', () => {
      const { container } = render(<SmartAvatarPreset imageUrl={url} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', url);
      expect(img).toHaveClass('smart:rounded-full', 'smart:size-11');
    });

    it('should render the initials chip when there is no imageUrl', () => {
      const { container } = render(<SmartAvatarPreset initials="AC" />);

      const chip = container.querySelector('span');
      expect(chip).toHaveTextContent('AC');
      expect(chip).toHaveClass('smart:bg-gray-700');
    });

    it('should render the icon placeholder without image and initials', () => {
      const { container } = render(<SmartAvatarPreset />);

      expect(container.querySelector('svg')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });

    it('should render an empty initials chip when placeholderType is initials', () => {
      const { container } = render(
        <SmartAvatarPreset options={{ placeholderType: 'initials' }} />,
      );

      expect(container.querySelector('svg')).toBeNull();
      expect(container.querySelector('span')).toHaveClass('smart:bg-gray-700');
    });

    it('should apply the rounded shape classes', () => {
      const { container } = render(
        <SmartAvatarPreset imageUrl={url} shape="rounded" />,
      );

      const img = container.querySelector('img');
      expect(img).toHaveClass('smart:rounded-lg');
      expect(img).not.toHaveClass('smart:rounded-full');
    });

    it('should apply the size classes of the requested size', () => {
      const { container } = render(
        <SmartAvatarPreset imageUrl={url} size="xl" />,
      );

      expect(container.querySelector('img')).toHaveClass('smart:size-20');
    });

    it('should render a status dot at the top when notificationPosition is top', () => {
      const { container } = render(
        <SmartAvatarPreset imageUrl={url} notificationPosition="top" />,
      );

      expect(container.querySelector('span')).toHaveClass(
        'smart:top-0',
        'smart:rounded-full',
      );
    });

    it('should render a status dot at the bottom when notificationPosition is bottom', () => {
      const { container } = render(
        <SmartAvatarPreset imageUrl={url} notificationPosition="bottom" />,
      );

      expect(container.querySelector('span')).toHaveClass('smart:bottom-0');
    });

    it('should not render a status dot by default', () => {
      const { container } = render(<SmartAvatarPreset imageUrl={url} />);

      expect(container.querySelector('span')).toBeNull();
    });

    it('should render one stacked member per group item', () => {
      const { container } = render(
        <SmartAvatarPreset
          group={[
            { id: '1', imageUrl: 'https://example.com/1.png' },
            { id: '2', initials: 'AC' },
            { id: '3', imageUrl: 'https://example.com/3.png' },
          ]}
        />,
      );

      expect(container.querySelectorAll('img')).toHaveLength(2);
      expect(container.querySelector('span')).toHaveTextContent('AC');
    });

    it('should reverse the stack when stackDirection is bottom-to-top', () => {
      const { container } = render(
        <SmartAvatarPreset
          group={[{ id: '1', initials: 'AC' }]}
          options={{ stackDirection: 'bottom-to-top' }}
        />,
      );

      expect(container.querySelector('div')).toHaveClass(
        'smart:flex-row-reverse',
      );
    });

    it('should apply className on the avatar itself', () => {
      const { container } = render(
        <SmartAvatarPreset imageUrl={url} className="my-extra-class" />,
      );

      expect(container.querySelector('img')).toHaveClass('my-extra-class');
    });

    it('should apply className on the status wrapper, not the avatar', () => {
      const { container } = render(
        <SmartAvatarPreset
          imageUrl={url}
          notificationPosition="top"
          className="my-extra-class"
        />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:relative',
        'my-extra-class',
      );
      expect(container.querySelector('img')).not.toHaveClass('my-extra-class');
    });

    it('should apply className on the group container', () => {
      const { container } = render(
        <SmartAvatarPreset
          group={[{ id: '1', initials: 'AC' }]}
          className="my-extra-class"
        />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:flex',
        'my-extra-class',
      );
    });
  });
});
