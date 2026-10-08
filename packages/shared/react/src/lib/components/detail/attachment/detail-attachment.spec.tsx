import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailAttachment } from './detail-attachment';
import { SmartDetailAttachmentPreset } from './preset/detail-attachment-preset';
import { IDetailOptions } from '../../../models';
import { SmartProvider } from '../../../providers/smart-provider';
import { FileService } from '../../../services/file/file.service';

interface Attachment {
  id: string;
  fileName?: string;
  name?: string;
}

@Model({})
class Invoice {
  @Field({ type: FieldType.attachment, details: true })
  file: Attachment | null = null;
}

function options(file?: Attachment): IDetailOptions<Invoice> {
  return {
    key: 'file',
    item:
      file === undefined ? undefined : Object.assign(new Invoice(), { file }),
    options: { type: FieldType.attachment },
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

describe('@smartsoft001/react: SmartDetailAttachment', () => {
  it('should render the translated download button', () => {
    setup(<SmartDetailAttachment options={options({ id: 'abc' })} />);

    expect(
      screen.getByRole('button', { name: 'download' }),
    ).toBeInTheDocument();
  });

  it('should download the file on click', () => {
    const { fileService } = setup(
      <SmartDetailAttachment options={options({ id: 'abc' })} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'download' }));

    expect(fileService.download).toHaveBeenCalledWith('abc');
  });

  it('should render nothing when there is no item', () => {
    setup(<SmartDetailAttachment options={options()} />);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should append className to the button', () => {
    setup(
      <SmartDetailAttachment
        options={options({ id: 'abc' })}
        className="my-custom-class"
      />,
    );

    expect(screen.getByRole('button', { name: 'download' })).toHaveClass(
      'my-custom-class',
      'smart:inline-flex',
    );
  });
});

describe('@smartsoft001/react: SmartDetailAttachmentPreset', () => {
  it('should render the chip', () => {
    const { container } = setup(
      <SmartDetailAttachmentPreset options={options({ id: 'abc' })} />,
    );

    expect(container.querySelector('[data-role="chip"]')).toBeInTheDocument();
  });

  it('should render nothing when there is no item', () => {
    const { container } = setup(
      <SmartDetailAttachmentPreset options={options()} />,
    );

    expect(container.querySelector('[data-role="chip"]')).toBeNull();
  });

  it('should show the file name', () => {
    const { container } = setup(
      <SmartDetailAttachmentPreset
        options={options({ id: 'abc', fileName: 'report.pdf' })}
      />,
    );

    expect(container.querySelector('[data-role="name"]')?.textContent).toBe(
      'report.pdf',
    );
  });

  it('should fall back to the name of the file', () => {
    const { container } = setup(
      <SmartDetailAttachmentPreset
        options={options({ id: 'abc', name: 'photo.png' })}
      />,
    );

    expect(container.querySelector('[data-role="name"]')?.textContent).toBe(
      'photo.png',
    );
  });

  it('should hide the name without fileName or name', () => {
    const { container } = setup(
      <SmartDetailAttachmentPreset options={options({ id: 'abc' })} />,
    );

    expect(container.querySelector('[data-role="name"]')).toBeNull();
  });

  it('should download the file on a click on the download button', () => {
    const { fileService } = setup(
      <SmartDetailAttachmentPreset options={options({ id: 'abc' })} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'download' }));

    expect(fileService.download).toHaveBeenCalledWith('abc');
  });

  it('should append className to the chip', () => {
    const { container } = setup(
      <SmartDetailAttachmentPreset
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
