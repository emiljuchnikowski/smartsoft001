import { render, screen } from '@testing-library/react';

import { SmartInputError } from './input-error';
import { SmartInputErrorPreset } from './preset/input-error-preset';
import { SmartProvider } from '../../../providers/smart-provider';

describe('@smartsoft001/react: SmartInputError', () => {
  it.each([
    ['standard', SmartInputError],
    ['preset', SmartInputErrorPreset],
  ])('%s: should show the required message', (_name, Error) => {
    render(
      <SmartProvider language="eng">
        <Error errors={{ required: true }} />
      </SmartProvider>,
    );

    expect(screen.getByText('field is required')).toBeInTheDocument();
  });

  it('should hide the confirm message while the field is required', () => {
    render(
      <SmartProvider language="eng">
        <SmartInputError errors={{ required: true, confirm: true }} />
      </SmartProvider>,
    );

    expect(screen.queryByText('bad confirmed')).not.toBeInTheDocument();
  });

  it('should show the required length of a minlength error', () => {
    render(
      <SmartProvider language="eng">
        <SmartInputError
          errors={{ minlength: { requiredLength: 3, actualLength: 1 } }}
        />
      </SmartProvider>,
    );

    expect(screen.getByText(/: 3$/)).toBeInTheDocument();
  });

  it('should show a custom message as is', () => {
    render(<SmartInputError errors={{ customMessage: 'Too late' }} />);

    expect(screen.getByText('Too late')).toBeInTheDocument();
  });

  it('should render nothing without errors', () => {
    const { container } = render(<SmartInputError errors={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    ['standard', SmartInputError],
    ['preset', SmartInputErrorPreset],
  ])(
    '%s: should show the PESEL message for the pesel preset invalidPesel error',
    (_name, Error) => {
      // Arrange
      const errors = { invalidPesel: true };

      // Act
      render(
        <SmartProvider language="eng">
          <Error errors={errors} />
        </SmartProvider>,
      );

      // Assert
      expect(screen.getByText('invalid pesel')).toBeInTheDocument();
    },
  );

  it('should show the PESEL message once for both pesel and invalidPesel', () => {
    // Arrange
    const errors = { pesel: true, invalidPesel: true };

    // Act
    render(
      <SmartProvider language="eng">
        <SmartInputError errors={errors} />
      </SmartProvider>,
    );

    // Assert
    expect(screen.getAllByText('invalid pesel')).toHaveLength(1);
  });

  it('should mark the preset messages as alerts', () => {
    render(<SmartInputErrorPreset errors={{ email: true, pesel: true }} />);

    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });
});
