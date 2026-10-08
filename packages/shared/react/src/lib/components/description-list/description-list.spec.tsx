import { render, screen } from '@testing-library/react';

import { SmartDescriptionList } from './description-list';
import { SmartDescriptionListProps } from './description-list.types';
import { SmartDescriptionListPreset } from './preset/description-list-preset';
import { SmartDescriptionListStandard } from './standard/description-list-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartDescriptionList', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartDescriptionList
          options={{ title: 'Hello' }}
          className="passed"
        />,
      );

      expect(container.querySelector('div.passed .list h3')).toHaveTextContent(
        'Hello',
      );
    });

    it('should render the implementation registered as components["description-list"]', () => {
      const Custom = ({ options, className }: SmartDescriptionListProps) => (
        <div data-testid="custom" className={className}>
          {options?.title}
        </div>
      );

      render(
        <SmartProvider components={{ 'description-list': Custom }}>
          <SmartDescriptionList
            options={{ title: 'Hello' }}
            className="passed"
          />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveClass('passed');
    });

    it('should not render the standard implementation when one is registered', () => {
      const Custom = () => <div data-testid="custom" />;

      const { container } = render(
        <SmartProvider components={{ 'description-list': Custom }}>
          <SmartDescriptionList options={{ title: 'Hello' }} />
        </SmartProvider>,
      );

      expect(container.querySelector('dl')).toBeNull();
    });
  });

  describe('standard', () => {
    it('should always render the list wrapper with a <dl>', () => {
      const { container } = render(<SmartDescriptionListStandard />);

      expect(container.querySelector('.list > dl')).toBeInTheDocument();
    });

    it('should not render <dt> or <dd> without items', () => {
      const { container } = render(<SmartDescriptionListStandard />);

      expect(container.querySelectorAll('dt, dd')).toHaveLength(0);
    });

    it('should not render any optional slot when none are provided', () => {
      const { container } = render(
        <SmartDescriptionListStandard options={{}} />,
      );

      expect(
        container.querySelectorAll(
          '.title, .description, .attachments, .footer, .item, .action',
        ),
      ).toHaveLength(0);
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartDescriptionListStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render <h3 class="title"> with options.title', () => {
      const { container } = render(
        <SmartDescriptionListStandard
          options={{ title: 'Applicant Information' }}
        />,
      );

      expect(container.querySelector('h3.title')).toHaveTextContent(
        'Applicant Information',
      );
    });

    it('should render <p class="description"> with options.description', () => {
      const { container } = render(
        <SmartDescriptionListStandard
          options={{ description: 'Personal details and application.' }}
        />,
      );

      expect(container.querySelector('p.description')).toHaveTextContent(
        'Personal details and application.',
      );
    });

    it('should not render <h3.title> when options.title is missing', () => {
      const { container } = render(
        <SmartDescriptionListStandard
          options={{ description: 'Only description' }}
        />,
      );

      expect(container.querySelector('h3.title')).toBeNull();
    });

    it('should render <dt> with item.label and <dd> with item.value', () => {
      const { container } = render(
        <SmartDescriptionListStandard
          options={{ items: [{ label: 'Full name', value: 'Margot Foster' }] }}
        />,
      );

      expect([
        container.querySelector('.item dt')?.textContent,
        container.querySelector('.item dd')?.textContent,
      ]).toEqual(['Full name', 'Margot Foster']);
    });

    it('should render one <.item> per items entry', () => {
      const { container } = render(
        <SmartDescriptionListStandard
          options={{
            items: [
              { label: 'Full name', value: 'Margot Foster' },
              { label: 'Application for', value: 'Backend Developer' },
              { label: 'Email address', value: 'margotfoster@example.com' },
            ],
          }}
        />,
      );

      expect(container.querySelectorAll('.item')).toHaveLength(3);
    });

    it('should render valueTpl instead of value inside <dd>', () => {
      const { container } = render(
        <SmartDescriptionListStandard
          options={{
            items: [
              {
                label: 'Full name',
                value: 'Margot Foster',
                valueTpl: <span className="custom-value">Custom value</span>,
              },
            ],
          }}
        />,
      );

      expect(container.querySelector('.item dd')?.innerHTML).toBe(
        '<span class="custom-value">Custom value</span>',
      );
    });

    it('should render actionTpl inside <span class="action"> next to the value', () => {
      const { container } = render(
        <SmartDescriptionListStandard
          options={{
            items: [
              {
                label: 'Full name',
                value: 'Margot Foster',
                actionTpl: <button className="action-btn">Update</button>,
              },
            ],
          }}
        />,
      );

      expect(
        container.querySelector('.item dd span.action button.action-btn'),
      ).toBeInTheDocument();
    });

    it('should render attachmentsTpl inside <.attachments>', () => {
      const { container } = render(
        <SmartDescriptionListStandard
          options={{
            attachmentsTpl: (
              <ul className="attachments-list">
                <li>resume.pdf</li>
              </ul>
            ),
          }}
        />,
      );

      expect(
        container.querySelector('.list > .attachments ul.attachments-list'),
      ).toBeInTheDocument();
    });

    it('should render footerTpl inside <.footer>', () => {
      const { container } = render(
        <SmartDescriptionListStandard
          options={{
            footerTpl: <button className="footer-btn">Read more</button>,
          }}
        />,
      );

      expect(
        container.querySelector('.list > .footer button.footer-btn'),
      ).toBeInTheDocument();
    });
  });

  describe('preset', () => {
    function query(container: HTMLElement, selector: string) {
      return container.querySelector(selector);
    }

    const item = { label: 'Full name', value: 'Margot Foster' };

    it('should always render the list zone', () => {
      const { container } = render(<SmartDescriptionListPreset />);

      expect(query(container, 'dl[data-role="list"]')).toHaveClass(
        'smart:divide-y',
      );
    });

    it('should render the header with the title', () => {
      const { container } = render(
        <SmartDescriptionListPreset
          options={{ title: 'Applicant Information' }}
        />,
      );

      expect(query(container, '[data-role="header"] h3')).toHaveTextContent(
        'Applicant Information',
      );
    });

    it('should render the header with the description', () => {
      const { container } = render(
        <SmartDescriptionListPreset
          options={{ description: 'Personal details and application.' }}
        />,
      );

      expect(query(container, '[data-role="header"] p')).toHaveTextContent(
        'Personal details and application.',
      );
    });

    it('should not render the header without title and description', () => {
      const { container } = render(
        <SmartDescriptionListPreset options={{ items: [item] }} />,
      );

      expect(query(container, '[data-role="header"]')).toBeNull();
    });

    it('should merge className onto the list zone, keeping its classes', () => {
      const { container } = render(
        <SmartDescriptionListPreset className="my-extra-class" />,
      );

      expect(query(container, '[data-role="list"]')).toHaveClass(
        'my-extra-class',
        'smart:divide-y',
      );
    });

    it('should render one row per item', () => {
      const { container } = render(
        <SmartDescriptionListPreset
          options={{
            items: [
              item,
              { label: 'Application for', value: 'Backend Developer' },
            ],
          }}
        />,
      );

      expect(container.querySelectorAll('[data-role="row"]')).toHaveLength(2);
    });

    it('should render the term and the value of an item', () => {
      const { container } = render(
        <SmartDescriptionListPreset options={{ items: [item] }} />,
      );

      expect([
        query(container, 'dt[data-role="term"]')?.textContent,
        query(container, 'dd[data-role="value"]')?.textContent,
      ]).toEqual(['Full name', 'Margot Foster']);
    });

    it('should render valueTpl instead of value', () => {
      const { container } = render(
        <SmartDescriptionListPreset
          options={{
            items: [
              {
                ...item,
                valueTpl: <span className="custom-value">Custom value</span>,
              },
            ],
          }}
        />,
      );

      expect(query(container, '[data-role="value"]')?.innerHTML).toBe(
        '<span class="custom-value">Custom value</span>',
      );
    });

    it('should render actionTpl in the action zone of the row', () => {
      const { container } = render(
        <SmartDescriptionListPreset
          options={{
            items: [
              {
                ...item,
                actionTpl: <button className="action-btn">Update</button>,
              },
            ],
          }}
        />,
      );

      expect(
        query(
          container,
          '[data-role="row"] > [data-role="action"] button.action-btn',
        ),
      ).toBeInTheDocument();
    });

    it('should not render the action zone without actionTpl', () => {
      const { container } = render(
        <SmartDescriptionListPreset options={{ items: [item] }} />,
      );

      expect(query(container, '[data-role="action"]')).toBeNull();
    });

    it('should render attachmentsTpl in the attachments zone', () => {
      const { container } = render(
        <SmartDescriptionListPreset
          options={{
            attachmentsTpl: <ul className="attachments-list" />,
          }}
        />,
      );

      expect(
        query(container, '[data-role="attachments"] ul.attachments-list'),
      ).toBeInTheDocument();
    });

    it('should not render the attachments zone without attachmentsTpl', () => {
      const { container } = render(
        <SmartDescriptionListPreset options={{ items: [item] }} />,
      );

      expect(query(container, '[data-role="attachments"]')).toBeNull();
    });

    it('should render footerTpl in the footer zone', () => {
      const { container } = render(
        <SmartDescriptionListPreset
          options={{
            footerTpl: <button className="footer-btn">Read more</button>,
          }}
        />,
      );

      expect(
        query(container, '[data-role="footer"] button.footer-btn'),
      ).toBeInTheDocument();
    });

    it('should not render the footer zone without footerTpl', () => {
      const { container } = render(
        <SmartDescriptionListPreset options={{ items: [item] }} />,
      );

      expect(query(container, '[data-role="footer"]')).toBeNull();
    });
  });
});
