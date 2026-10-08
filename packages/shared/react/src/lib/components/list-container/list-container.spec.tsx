import { render, screen } from '@testing-library/react';

import { SmartListContainer } from './list-container';
import { SmartListContainerProps } from './list-container.types';
import { SmartListContainerStandard } from './standard/list-container-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartListContainer', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      render(
        <SmartListContainer>
          <div>child</div>
        </SmartListContainer>,
      );

      expect(screen.getByRole('list')).toHaveTextContent('child');
    });

    it('should pass options and className to the standard implementation', () => {
      render(
        <SmartListContainer
          options={{ variant: 'separate-cards' }}
          className="passed-class"
        />,
      );

      const list = screen.getByRole('list');

      expect(list).toHaveClass('passed-class');
      expect(list).toHaveAttribute('data-variant', 'separate-cards');
    });

    it('should render the implementation registered as components["list-container"]', () => {
      const Custom = ({ children }: SmartListContainerProps) => (
        <section data-testid="custom">{children}</section>
      );

      render(
        <SmartProvider components={{ 'list-container': Custom }}>
          <SmartListContainer>child</SmartListContainer>
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('child');
      expect(screen.queryByRole('list')).toBeNull();
    });
  });

  describe('standard', () => {
    it('should render a div with role="list"', () => {
      render(<SmartListContainerStandard />);

      expect(screen.getByRole('list').tagName).toBe('DIV');
    });

    it('should not set data-variant without options', () => {
      render(<SmartListContainerStandard />);

      expect(screen.getByRole('list')).not.toHaveAttribute('data-variant');
    });

    it('should set data-variant from options', () => {
      render(
        <SmartListContainerStandard options={{ variant: 'card-dividers' }} />,
      );

      expect(screen.getByRole('list')).toHaveAttribute(
        'data-variant',
        'card-dividers',
      );
    });

    it('should render children inside the list container', () => {
      render(
        <SmartListContainerStandard>
          <div className="child-1">child 1</div>
          <div className="child-2">child 2</div>
        </SmartListContainerStandard>,
      );

      const list = screen.getByRole('list');

      expect(list.querySelector('.child-1')).toBeInTheDocument();
      expect(list.querySelector('.child-2')).toBeInTheDocument();
    });

    it('should apply className on the list element', () => {
      render(<SmartListContainerStandard className="my-extra-class" />);

      expect(screen.getByRole('list')).toHaveClass('my-extra-class');
    });
  });
});
