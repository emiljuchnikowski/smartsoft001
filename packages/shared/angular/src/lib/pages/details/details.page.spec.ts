import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPage } from './details.page';
import { DetailsComponent } from '../../components/details/details.component';
import { IDetailsOptions, IIconButtonOptions } from '../../models';
import { ModalService, StyleService } from '../../services';

interface TestItem {
  id: string;
  name: string;
}

@Component({
  selector: 'smart-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p data-role="details">{{ options()?.item?.()?.name }}</p>',
})
class DetailsStubComponent {
  options = input<IDetailsOptions<TestItem>>();
}

describe('@smartsoft001/shared-angular: DetailsPage', () => {
  const item: TestItem = { id: 'item-1', name: 'Margot Foster' };
  let modalService: { dismiss: jest.Mock };
  let styleService: { init: jest.Mock };

  function options(
    extra: Partial<IDetailsOptions<TestItem>> = {},
  ): IDetailsOptions<TestItem> {
    return { type: Object, item: signal(item), ...extra };
  }

  function configure(providers: unknown[] = []): void {
    modalService = { dismiss: jest.fn() };
    styleService = { init: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: ModalService, useValue: modalService },
        { provide: StyleService, useValue: styleService },
        ...(providers as []),
      ],
    }).overrideComponent(DetailsPage, {
      remove: { imports: [DetailsComponent] },
      add: { imports: [DetailsStubComponent] },
    });
  }

  function create(
    value?: IDetailsOptions<TestItem>,
  ): ComponentFixture<DetailsPage<TestItem>> {
    const fixture = TestBed.createComponent(DetailsPage<TestItem>);
    if (value) fixture.componentRef.setInput('value', value);
    fixture.detectChanges();

    return fixture;
  }

  function buttonsFor(
    extra: Partial<IDetailsOptions<TestItem>>,
  ): IIconButtonOptions[] {
    const fixture = create(options(extra));

    return fixture.componentInstance.pageOptions()
      .endButtons as IIconButtonOptions[];
  }

  describe('rendering', () => {
    beforeEach(() => configure());

    it('should render the details of its value', () => {
      const fixture = create(options());

      expect(
        fixture.nativeElement.querySelector('[data-role="details"]')
          .textContent,
      ).toBe('Margot Foster');
    });

    it('should render nothing without a value', () => {
      const fixture = create();

      expect(fixture.nativeElement.querySelector('smart-details')).toBeNull();
    });

    it('should apply the application style to its element', () => {
      const fixture = create(options());

      expect(styleService.init).toHaveBeenCalledWith(
        expect.objectContaining({ nativeElement: fixture.nativeElement }),
      );
    });
  });

  describe('page options', () => {
    beforeEach(() => configure());

    it('should use the details title by default', () => {
      const fixture = create(options());

      expect(fixture.componentInstance.pageOptions()).toEqual({
        title: 'details',
        hideMenuButton: true,
        endButtons: [],
      });
    });

    it('should use the title of the value', () => {
      const fixture = create(options({ title: 'Member' }));

      expect(fixture.componentInstance.pageOptions().title).toBe('Member');
    });

    it('should call removeHandler with the item and close the modal', () => {
      const removeHandler = jest.fn();
      const [remove] = buttonsFor({ removeHandler });

      remove.handler?.();

      expect(remove.icon).toBe('trash');
      expect(removeHandler).toHaveBeenCalledWith(item);
      expect(modalService.dismiss).toHaveBeenCalled();
    });

    it('should call itemHandler with the item id, not removeHandler', () => {
      const removeHandler = jest.fn();
      const itemHandler = jest.fn();
      const [, forward] = buttonsFor({ removeHandler, itemHandler });

      forward.handler?.();

      expect(forward.icon).toBe('arrow-forward-outline');
      expect(itemHandler).toHaveBeenCalledWith('item-1');
      expect(removeHandler).not.toHaveBeenCalled();
      expect(modalService.dismiss).toHaveBeenCalled();
    });
  });

  describe('in a modal', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should render the value passed through the modal props', async () => {
      TestBed.configureTestingModule({
        providers: [
          ModalService,
          { provide: StyleService, useValue: { init: jest.fn() } },
        ],
      }).overrideComponent(DetailsPage, {
        remove: { imports: [DetailsComponent] },
        add: { imports: [DetailsStubComponent] },
      });
      const service = TestBed.inject(ModalService);

      await service.show({
        component: DetailsPage,
        props: { value: options() },
      });
      TestBed.inject(ApplicationRef).tick();

      expect(
        document.body.querySelector('smart-modal [data-role="details"]')
          ?.textContent,
      ).toBe('Margot Foster');
    });
  });
});
