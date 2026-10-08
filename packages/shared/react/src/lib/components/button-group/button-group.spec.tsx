import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { SmartButtonGroup } from './button-group';
import { SmartButtonGroupProps } from './button-group.types';
import { SmartButtonGroupPreset } from './preset/button-group-preset';
import { getButtonGroupButtonClasses } from './preset/preset-classes';
import { SmartButtonGroupStandard } from './standard/button-group-standard';
import { IButtonGroupButton } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';

const BUTTONS: IButtonGroupButton[] = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Bravo', count: 3 },
  { id: 'c', label: 'Charlie', disabled: true },
];

describe('@smartsoft001/react: SmartButtonGroup', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      render(<SmartButtonGroup buttons={BUTTONS} />);

      expect(screen.getByRole('group')).not.toHaveClass('smart:inline-flex');
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('should render the implementation registered as components.button-group', () => {
      const Custom = ({ buttons }: SmartButtonGroupProps) => (
        <div className="injected-button-group">{buttons?.length}</div>
      );

      const { container } = render(
        <SmartProvider components={{ 'button-group': Custom }}>
          <SmartButtonGroup buttons={BUTTONS} />
        </SmartProvider>,
      );

      expect(
        container.querySelector('.injected-button-group'),
      ).toHaveTextContent('3');
    });

    it('should call onButtonClick of the implementation', () => {
      const onButtonClick = jest.fn();
      render(
        <SmartButtonGroup buttons={BUTTONS} onButtonClick={onButtonClick} />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Alpha' }));

      expect(onButtonClick).toHaveBeenCalledWith({ buttonId: 'a' });
    });

    it('should call onSelectedChange of the implementation', () => {
      const onSelectedChange = jest.fn();
      render(
        <SmartButtonGroup
          buttons={BUTTONS}
          onSelectedChange={onSelectedChange}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: /Bravo/ }));

      expect(onSelectedChange).toHaveBeenCalledWith('b');
    });

    it('should pass selected and className to the implementation', () => {
      render(
        <SmartButtonGroup
          buttons={BUTTONS}
          selected="a"
          className="passed-class"
        />,
      );

      expect(screen.getByRole('group')).toHaveClass('passed-class');
      expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });
  });

  describe('standard', () => {
    it('should render a div with role="group"', () => {
      render(<SmartButtonGroupStandard />);

      expect(screen.getByRole('group').tagName).toBe('DIV');
    });

    it('should render no buttons by default', () => {
      render(<SmartButtonGroupStandard />);

      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('should render one button per item', () => {
      render(<SmartButtonGroupStandard buttons={BUTTONS} />);

      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('should render the label of a button', () => {
      render(<SmartButtonGroupStandard buttons={BUTTONS} />);

      expect(screen.getByText('Alpha')).toHaveClass('smart-button-group-label');
    });

    it('should emit onButtonClick with the button id on click', () => {
      const onButtonClick = jest.fn();
      render(
        <SmartButtonGroupStandard
          buttons={BUTTONS}
          onButtonClick={onButtonClick}
        />,
      );

      fireEvent.click(screen.getAllByRole('button')[1]);

      expect(onButtonClick).toHaveBeenCalledWith({ buttonId: 'b' });
    });

    it('should select the clicked button', () => {
      render(<SmartButtonGroupStandard buttons={BUTTONS} />);

      fireEvent.click(screen.getAllByRole('button')[1]);

      expect(screen.getAllByRole('button')[1]).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    it('should report the clicked button through onSelectedChange', () => {
      const onSelectedChange = jest.fn();
      render(
        <SmartButtonGroupStandard
          buttons={BUTTONS}
          onSelectedChange={onSelectedChange}
        />,
      );

      fireEvent.click(screen.getAllByRole('button')[1]);

      expect(onSelectedChange).toHaveBeenCalledWith('b');
    });

    it('should reflect selected via aria-pressed', () => {
      render(<SmartButtonGroupStandard buttons={BUTTONS} selected="a" />);

      const buttons = screen.getAllByRole('button');

      expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
      expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');
    });

    it('should start from defaultSelected when uncontrolled', () => {
      render(
        <SmartButtonGroupStandard buttons={BUTTONS} defaultSelected="b" />,
      );

      expect(screen.getAllByRole('button')[1]).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    it('should keep the controlled selection until the parent changes it', () => {
      render(<SmartButtonGroupStandard buttons={BUTTONS} selected="a" />);

      fireEvent.click(screen.getAllByRole('button')[1]);

      expect(screen.getAllByRole('button')[0]).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    it('should follow the parent when it binds selected two-way', () => {
      function Host() {
        const [selected, setSelected] = useState<string | undefined>('a');

        return (
          <SmartButtonGroupStandard
            buttons={BUTTONS}
            selected={selected}
            onSelectedChange={setSelected}
          />
        );
      }
      render(<Host />);

      fireEvent.click(screen.getAllByRole('button')[1]);

      expect(screen.getAllByRole('button')[1]).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    it('should honour the disabled flag of a button', () => {
      render(<SmartButtonGroupStandard buttons={BUTTONS} />);

      const buttons = screen.getAllByRole('button');

      expect(buttons[2]).toBeDisabled();
      expect(buttons[0]).toBeEnabled();
    });

    it('should render the count when given', () => {
      const { container } = render(
        <SmartButtonGroupStandard buttons={BUTTONS} />,
      );

      const counts = container.querySelectorAll('.smart-button-group-count');

      expect(counts).toHaveLength(1);
      expect(counts[0]).toHaveTextContent('3');
    });

    it('should render a zero count', () => {
      const { container } = render(
        <SmartButtonGroupStandard
          buttons={[{ id: 'x', label: 'X', count: 0 }]}
        />,
      );

      expect(
        container.querySelector('.smart-button-group-count'),
      ).toHaveTextContent('0');
    });

    it('should apply className on the group', () => {
      render(<SmartButtonGroupStandard className="my-extra-class" />);

      expect(screen.getByRole('group')).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    const PRESET_BUTTONS: IButtonGroupButton[] = [
      { id: 'years', label: 'Years' },
      { id: 'month', label: 'Month' },
      { id: 'date', label: 'Date' },
    ];

    it('should render one button per item', () => {
      render(<SmartButtonGroupPreset buttons={PRESET_BUTTONS} />);

      expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
        'Years',
        'Month',
        'Date',
      ]);
    });

    it('should apply the segmented group container classes', () => {
      render(<SmartButtonGroupPreset buttons={PRESET_BUTTONS} />);

      expect(screen.getByRole('group')).toHaveClass(
        'smart:inline-flex',
        'smart:rounded-lg',
        'smart:shadow-2xs',
      );
    });

    it('should apply the base button classes', () => {
      render(<SmartButtonGroupPreset buttons={PRESET_BUTTONS} />);

      expect(screen.getAllByRole('button')[0]).toHaveClass(
        'smart:bg-white',
        'smart:dark:bg-gray-800',
        'smart:first:rounded-s-lg',
        'smart:py-3',
        'smart:px-4',
      );
    });

    it('should mark the selected button as pressed and emphasised', () => {
      render(
        <SmartButtonGroupPreset buttons={PRESET_BUTTONS} selected="month" />,
      );

      const selected = screen.getAllByRole('button')[1];

      expect(selected).toHaveAttribute('aria-pressed', 'true');
      expect(selected).toHaveClass('smart:text-blue-600');
    });

    it('should not emphasise the other buttons', () => {
      render(
        <SmartButtonGroupPreset buttons={PRESET_BUTTONS} selected="month" />,
      );

      expect(screen.getAllByRole('button')[0]).not.toHaveClass(
        'smart:text-blue-600',
      );
    });

    it('should disable a button flagged as disabled', () => {
      render(
        <SmartButtonGroupPreset
          buttons={[{ id: 'a', label: 'A', disabled: true }]}
        />,
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should render only the icon and an aria-label for the icon-only variant', () => {
      render(
        <SmartButtonGroupPreset
          buttons={[{ id: 'bold', label: 'Bold', icon: 'B' }]}
          options={{ variant: 'icon-only' }}
        />,
      );

      const button = screen.getByRole('button', { name: 'Bold' });

      expect(
        button.querySelector('span[aria-hidden="true"]'),
      ).toHaveTextContent('B');
      expect(button).toHaveTextContent(/^B$/);
    });

    it('should render the icon next to the label outside the icon-only variant', () => {
      render(
        <SmartButtonGroupPreset
          buttons={[{ id: 'bold', label: 'Bold', icon: 'B' }]}
        />,
      );

      const button = screen.getByRole('button');

      expect(button).not.toHaveAttribute('aria-label');
      expect(button).toHaveTextContent('BBold');
      expect(button.querySelector('span[aria-hidden="true"]')).toHaveClass(
        'smart:shrink-0',
        'smart:size-4',
      );
    });

    it('should render a count pill when a button has a count', () => {
      render(
        <SmartButtonGroupPreset
          buttons={[{ id: 'inbox', label: 'Inbox', count: 12 }]}
        />,
      );

      const pill = screen
        .getByRole('button')
        .querySelector('span[data-role="count"]');

      expect(pill).toHaveTextContent('12');
      expect(pill).toHaveClass('smart:rounded-full', 'smart:bg-gray-100');
    });

    it('should style the count pill with the stat palette for the with-stat variant', () => {
      render(
        <SmartButtonGroupPreset
          buttons={[{ id: 'inbox', label: 'Inbox', count: 12 }]}
          options={{ variant: 'with-stat' }}
        />,
      );

      const pill = screen
        .getByRole('button')
        .querySelector('span[data-role="count"]');

      expect(pill).toHaveClass('smart:bg-blue-100');
    });

    it('should not render the count pill for the icon-only variant', () => {
      render(
        <SmartButtonGroupPreset
          buttons={[{ id: 'inbox', label: 'Inbox', icon: 'I', count: 12 }]}
          options={{ variant: 'icon-only' }}
        />,
      );

      expect(
        screen.getByRole('button').querySelector('span[data-role="count"]'),
      ).toBeNull();
    });

    it('should emit onButtonClick and select the clicked button', () => {
      const onButtonClick = jest.fn();
      render(
        <SmartButtonGroupPreset
          buttons={PRESET_BUTTONS}
          onButtonClick={onButtonClick}
        />,
      );

      fireEvent.click(screen.getAllByRole('button')[2]);

      expect(onButtonClick).toHaveBeenCalledWith({ buttonId: 'date' });
      expect(screen.getAllByRole('button')[2]).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    it('should apply className on the group', () => {
      render(
        <SmartButtonGroupPreset
          buttons={PRESET_BUTTONS}
          className="my-extra-class"
        />,
      );

      expect(screen.getByRole('group')).toHaveClass(
        'my-extra-class',
        'smart:inline-flex',
      );
    });
  });

  describe('getButtonGroupButtonClasses', () => {
    it('should use the size padding without the active emphasis', () => {
      const result = getButtonGroupButtonClasses('sm', false);

      expect(result.endsWith('smart:py-2 smart:px-3')).toBe(true);
    });
  });
});
