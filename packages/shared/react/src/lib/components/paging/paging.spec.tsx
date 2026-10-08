import { fireEvent, render, renderHook, screen } from '@testing-library/react';

import { SmartPaging } from './paging';
import { SmartPagingProps } from './paging.types';
import { SmartPagingPreset } from './preset/paging-preset';
import { SmartPagingStandard } from './standard/paging-standard';
import { usePaging } from './use-paging';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartPaging', () => {
  describe('SmartPaging (wrapper)', () => {
    it('should render the standard implementation by default', () => {
      render(<SmartPaging totalPages={5} variant="centered" />);

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'data-variant',
        'centered',
      );
    });

    it('should forward the page props to the rendered implementation', () => {
      render(<SmartPaging currentPage={3} totalPages={5} />);

      expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent(
        '3',
      );
    });

    it('should forward onPageChange of the standard implementation', () => {
      const onPageChange = jest.fn();
      render(
        <SmartPaging
          currentPage={1}
          totalPages={5}
          onPageChange={onPageChange}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: '2' }));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should render the implementation registered as components.paging', () => {
      const Custom = ({ currentPage, onPageChange }: SmartPagingProps) => (
        <nav className="injected">
          <button type="button" onClick={() => onPageChange?.(3)}>
            {`injected ${currentPage}`}
          </button>
        </nav>
      );
      const onPageChange = jest.fn();

      render(
        <SmartProvider components={{ paging: Custom }}>
          <SmartPaging currentPage={2} onPageChange={onPageChange} />
        </SmartProvider>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'injected 2' }));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe('usePaging', () => {
    function paging(props: SmartPagingProps) {
      return renderHook(() => usePaging(props)).result.current;
    }

    it('should list every page when there are at most 7', () => {
      const result = paging({ currentPage: 3, totalPages: 5 });

      expect(result.pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('should list a single page by default', () => {
      const result = paging({});

      expect(result.pages).toEqual([1]);
    });

    it.each([
      [5, [1, '...', 4, 5, 6, '...', 10]],
      [1, [1, 2, '...', 10]],
      [10, [1, '...', 9, 10]],
      [2, [1, 2, 3, '...', 10]],
      [9, [1, '...', 8, 9, 10]],
    ])(
      'should collapse distant pages into ellipses (page %i of 10)',
      (currentPage, expected) => {
        const result = paging({ currentPage, totalPages: 10 });

        expect(result.pages).toEqual(expected);
      },
    );

    it('should show from 0 to 0 when there are no items', () => {
      const result = paging({});

      expect([result.showingFrom, result.showingTo]).toEqual([0, 0]);
    });

    it('should show the range of the current page', () => {
      const result = paging({ currentPage: 2, pageSize: 10, totalItems: 50 });

      expect([result.showingFrom, result.showingTo]).toEqual([11, 20]);
    });

    it('should end the range at totalItems on a partial last page', () => {
      const result = paging({ currentPage: 3, pageSize: 10, totalItems: 25 });

      expect(result.showingTo).toBe(25);
    });

    it('should call onPageChange for a page within range', () => {
      const onPageChange = jest.fn();
      const result = paging({ totalPages: 5, onPageChange });

      result.goToPage(3);

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it.each([0, 6])(
      'should not call onPageChange for page %i out of range',
      (page) => {
        const onPageChange = jest.fn();
        const result = paging({ totalPages: 5, onPageChange });

        result.goToPage(page);

        expect(onPageChange).not.toHaveBeenCalled();
      },
    );

    it('should go to the next page', () => {
      const onPageChange = jest.fn();
      const result = paging({ currentPage: 2, totalPages: 5, onPageChange });

      result.nextPage();

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('should not go past the last page', () => {
      const onPageChange = jest.fn();
      const result = paging({ onPageChange });

      result.nextPage();

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should go to the previous page', () => {
      const onPageChange = jest.fn();
      const result = paging({ currentPage: 3, totalPages: 5, onPageChange });

      result.previousPage();

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should not go before the first page', () => {
      const onPageChange = jest.fn();
      const result = paging({ totalPages: 5, onPageChange });

      result.previousPage();

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('SmartPagingStandard', () => {
    function renderStandard(props: SmartPagingProps) {
      return render(
        <SmartProvider language="eng">
          <SmartPagingStandard totalPages={5} totalItems={42} {...props} />
        </SmartProvider>,
      );
    }

    it('should render a pagination nav', () => {
      renderStandard({});

      expect(
        screen.getByRole('navigation', { name: 'Pagination' }),
      ).toBeInTheDocument();
    });

    it('should render the translated prev and next buttons', () => {
      render(<SmartPagingStandard totalPages={5} />);

      expect(
        screen.getByRole('button', { name: 'wstecz' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'dalej' })).toBeInTheDocument();
    });

    it('should disable prev on the first page', () => {
      renderStandard({ currentPage: 1 });

      expect(screen.getByRole('button', { name: 'prev' })).toBeDisabled();
    });

    it('should disable next on the last page', () => {
      renderStandard({ currentPage: 5 });

      expect(screen.getByRole('button', { name: 'next' })).toBeDisabled();
    });

    it('should call onPageChange when a page number is clicked', () => {
      const onPageChange = jest.fn();
      renderStandard({ currentPage: 1, onPageChange });

      fireEvent.click(screen.getByRole('button', { name: '3' }));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('should call onPageChange with the next page on next click', () => {
      const onPageChange = jest.fn();
      renderStandard({ currentPage: 2, onPageChange });

      fireEvent.click(screen.getByRole('button', { name: 'next' }));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('should call onPageChange with the previous page on prev click', () => {
      const onPageChange = jest.fn();
      renderStandard({ currentPage: 3, onPageChange });

      fireEvent.click(screen.getByRole('button', { name: 'prev' }));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should mark the active page with aria-current and the active classes', () => {
      renderStandard({ currentPage: 3 });

      const active = screen.getByRole('button', { current: 'page' });

      expect(active).toHaveTextContent('3');
      expect(active).toHaveClass('smart:bg-indigo-600', 'smart:font-semibold');
    });

    it('should not mark the other pages as current', () => {
      renderStandard({ currentPage: 3 });

      expect(screen.getByRole('button', { name: '2' })).not.toHaveAttribute(
        'aria-current',
      );
    });

    it('should render an ellipsis when pages exceed 7', () => {
      renderStandard({ totalPages: 20, currentPage: 10 });

      expect(screen.getAllByText('...')).toHaveLength(2);
    });

    it('should expose the default variant as data-variant on the nav', () => {
      renderStandard({});

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'data-variant',
        'card-footer',
      );
    });

    it('should reflect the variant in data-variant', () => {
      renderStandard({ variant: 'simple' });

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'data-variant',
        'simple',
      );
    });

    it('should apply className on the nav next to the base classes', () => {
      renderStandard({ className: 'my-extra-class' });

      expect(screen.getByRole('navigation')).toHaveClass(
        'smart:flex',
        'my-extra-class',
      );
    });
  });
  describe('SmartPagingPreset', () => {
    function renderPreset(props: SmartPagingProps) {
      return render(
        <SmartPagingPreset currentPage={1} totalPages={3} {...props} />,
      );
    }

    function pageButtons(container: HTMLElement): HTMLButtonElement[] {
      return Array.from(
        container.querySelectorAll<HTMLButtonElement>(
          'nav button[data-role="page"]',
        ),
      );
    }

    it('should render one button per page', () => {
      const { container } = renderPreset({});

      expect(pageButtons(container)).toHaveLength(3);
    });

    it('should mark the current page with aria-current and the active classes', () => {
      renderPreset({});

      const active = screen.getByRole('button', { current: 'page' });

      expect(active).toHaveTextContent('1');
      expect(active).toHaveClass('smart:bg-blue-600', 'smart:font-semibold');
    });

    it('should disable Previous on the first page', () => {
      renderPreset({});

      expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    });

    it('should disable Next on the last page', () => {
      renderPreset({ currentPage: 3 });

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('should call onPageChange when a page button is clicked', () => {
      const onPageChange = jest.fn();
      const { container } = renderPreset({ onPageChange });

      fireEvent.click(pageButtons(container)[1]);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange with the next page when Next is clicked', () => {
      const onPageChange = jest.fn();
      renderPreset({ onPageChange });

      fireEvent.click(screen.getByRole('button', { name: 'Next' }));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange with the previous page when Previous is clicked', () => {
      const onPageChange = jest.fn();
      renderPreset({ currentPage: 3, onPageChange });

      fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should render the results summary for the card-footer variant', () => {
      const { container } = renderPreset({
        variant: 'card-footer',
        pageSize: 10,
        totalItems: 25,
      });

      expect(container.querySelector('p')).toHaveTextContent(
        'Showing 1 to 10 of 25 results',
      );
    });

    it('should not render the results summary for the simple variant', () => {
      const { container } = renderPreset({ variant: 'simple' });

      expect(container.querySelector('p')).toBeNull();
    });

    it('should center the nav for the centered variant', () => {
      renderPreset({ variant: 'centered' });

      expect(screen.getByRole('navigation')).toHaveClass(
        'smart:justify-center',
      );
    });

    it('should render an ellipsis when there are many pages', () => {
      renderPreset({ totalPages: 20, currentPage: 10 });

      expect(screen.getAllByText('...')).toHaveLength(2);
    });

    it('should apply className on the container next to the variant classes', () => {
      const { container } = renderPreset({
        variant: 'simple',
        className: 'my-extra-class',
      });

      expect(container.firstElementChild).toHaveClass(
        'smart:flex',
        'my-extra-class',
      );
    });

    it('should hide the arrow icons from assistive technology', () => {
      const { container } = renderPreset({});

      const icons = container.querySelectorAll('nav svg');

      expect(icons).toHaveLength(2);
      icons.forEach((icon) =>
        expect(icon).toHaveAttribute('aria-hidden', 'true'),
      );
    });
  });
});
