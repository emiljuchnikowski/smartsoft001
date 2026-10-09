import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DetailsPage } from './details.page';
import { IDetailsOptions, IIconButtonOptions } from '../../models';
import { ModalService, StyleService } from '../../services';

interface TestItem {
  id: string;
  name: string;
}

describe('@smartsoft001/shared-angular: DetailsPage', () => {
  const item: TestItem = { id: 'item-1', name: 'Margot Foster' };
  let page: DetailsPage<TestItem>;
  let modalService: { dismiss: jest.Mock };

  function buttonsFor(options: Partial<IDetailsOptions<TestItem>>) {
    page.detailsOptions = {
      type: Object,
      item: signal(item),
      ...options,
    } as IDetailsOptions<TestItem>;
    // The buttons are built from the options the page was opened with.
    (page as unknown as { initButtons(): void }).initButtons();

    return page.pageOptions().endButtons as IIconButtonOptions[];
  }

  beforeEach(() => {
    modalService = { dismiss: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: ModalService, useValue: modalService },
        { provide: StyleService, useValue: { init: jest.fn() } },
      ],
    }).overrideComponent(DetailsPage, {
      set: { template: '', imports: [], styleUrls: [] },
    });

    page = TestBed.createComponent(DetailsPage<TestItem>).componentInstance;
  });

  it('should add no buttons without handlers', () => {
    // Act
    const buttons = buttonsFor({});

    // Assert
    expect(buttons).toEqual([]);
  });

  it('should call removeHandler with the item and close the modal', () => {
    // Arrange
    const removeHandler = jest.fn();
    const [remove] = buttonsFor({ removeHandler });

    // Act
    remove.handler?.();

    // Assert
    expect(remove.icon).toBe('trash');
    expect(removeHandler).toHaveBeenCalledWith(item);
    expect(modalService.dismiss).toHaveBeenCalled();
  });

  it('should call itemHandler with the item id, not removeHandler', () => {
    // Arrange
    const removeHandler = jest.fn();
    const itemHandler = jest.fn();
    const [, forward] = buttonsFor({ removeHandler, itemHandler });

    // Act
    forward.handler?.();

    // Assert
    expect(forward.icon).toBe('arrow-forward-outline');
    expect(itemHandler).toHaveBeenCalledWith('item-1');
    expect(removeHandler).not.toHaveBeenCalled();
    expect(modalService.dismiss).toHaveBeenCalled();
  });
});
