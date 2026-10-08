import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailPdf } from './detail-pdf';
import { SmartDetailPdfPreset } from './preset/detail-pdf-preset';
import { IDetailOptions } from '../../../models';
import { SmartProvider } from '../../../providers/smart-provider';
import { FileService } from '../../../services/file/file.service';

interface Attachment {
  id: string;
  fileName?: string;
  name?: string;
}

@Model({})
class Offer {
  @Field({ type: FieldType.pdf, details: true })
  brochure: Attachment | null = null;
}

function options(brochure?: Attachment): IDetailOptions<Offer> {
  return {
    key: 'brochure',
    item:
      brochure === undefined
        ? undefined
        : Object.assign(new Offer(), { brochure }),
    options: { type: FieldType.pdf },
  };
}

function setup(children: ReactNode) {
  const fileService = {
    getUrl: jest.fn((id: string) => `/files/${id}`),
    download: jest.fn(),
  };

  const view = render(
    <SmartProvider
      language="eng"
      fileService={fileService as unknown as FileService}
    >
      {children}
    </SmartProvider>,
  );

  return { ...view, fileService };
}

describe('@smartsoft001/react: SmartDetailPdf', () => {
  it('should render the translated show button', () => {
    setup(<SmartDetailPdf options={options({ id: 'abc' })} />);

    expect(screen.getByRole('button', { name: 'show' })).toBeInTheDocument();
  });

  it('should download the file on click', () => {
    const { fileService } = setup(
      <SmartDetailPdf options={options({ id: 'abc' })} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'show' }));

    expect(fileService.download).toHaveBeenCalledWith('abc');
  });

  it('should render nothing when there is no item', () => {
    setup(<SmartDetailPdf options={options()} />);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should append className to the button', () => {
    setup(
      <SmartDetailPdf
        options={options({ id: 'abc' })}
        className="my-custom-class"
      />,
    );

    expect(screen.getByRole('button', { name: 'show' })).toHaveClass(
      'my-custom-class',
      'smart:inline-flex',
    );
  });
});

describe('@smartsoft001/react: SmartDetailPdfPreset', () => {
  it('should render the chip', () => {
    const { container } = setup(
      <SmartDetailPdfPreset options={options({ id: 'abc' })} />,
    );

    expect(container.querySelector('[data-role="chip"]')).toBeInTheDocument();
  });

  it('should render nothing when there is no item', () => {
    const { container } = setup(<SmartDetailPdfPreset options={options()} />);

    expect(container.querySelector('[data-role="chip"]')).toBeNull();
  });

  it('should show the file name', () => {
    const { container } = setup(
      <SmartDetailPdfPreset
        options={options({ id: 'abc', fileName: 'brochure.pdf' })}
      />,
    );

    expect(container.querySelector('[data-role="name"]')?.textContent).toBe(
      'brochure.pdf',
    );
  });

  it('should fall back to the name of the file', () => {
    const { container } = setup(
      <SmartDetailPdfPreset
        options={options({ id: 'abc', name: 'offer.pdf' })}
      />,
    );

    expect(container.querySelector('[data-role="name"]')?.textContent).toBe(
      'offer.pdf',
    );
  });

  it('should hide the name without fileName or name', () => {
    const { container } = setup(
      <SmartDetailPdfPreset options={options({ id: 'abc' })} />,
    );

    expect(container.querySelector('[data-role="name"]')).toBeNull();
  });

  it('should download the file on a click on the show button', () => {
    const { fileService } = setup(
      <SmartDetailPdfPreset options={options({ id: 'abc' })} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'show' }));

    expect(fileService.download).toHaveBeenCalledWith('abc');
  });

  it('should append className to the chip', () => {
    const { container } = setup(
      <SmartDetailPdfPreset
        options={options({ id: 'abc' })}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('[data-role="chip"]')).toHaveClass(
      'my-custom-class',
      'smart:inline-flex',
    );
  });
});
