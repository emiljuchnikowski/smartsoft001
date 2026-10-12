import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  Injector,
  input,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { ModalPresetComponent } from '../../components/modal/preset/preset.component';
import { MODAL_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const GREETING = new InjectionToken<string>('GREETING');

@Component({
  selector: 'smart-test-modal-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>Hello {{ name() }}</p>
    <button type="button" (click)="dismiss()?.('picked')">Pick</button>
  `,
})
class BodyComponent {
  name = input('');
  dismiss = input<(data?: unknown) => void>();
}

@Component({
  selector: 'smart-test-modal-service-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" (click)="close()">Close me</button>`,
})
class ServiceBodyComponent {
  private modalService = inject(ModalService);

  close(): void {
    this.modalService.dismiss('from-service');
  }
}

@Component({
  selector: 'smart-test-modal-injected-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ greeting }}</p>`,
})
class InjectedBodyComponent {
  greeting = inject(GREETING);
}

describe('@smartsoft001/angular: ModalService', () => {
  let service: ModalService;
  let appRef: ApplicationRef;

  function setup(providers: unknown[] = []): void {
    TestBed.configureTestingModule({
      providers: [ModalService, ...(providers as [])],
    });

    service = TestBed.inject(ModalService);
    appRef = TestBed.inject(ApplicationRef);
  }

  function modals(): HTMLElement[] {
    return Array.from(document.body.querySelectorAll('smart-modal'));
  }

  function button(name: string): HTMLButtonElement {
    return Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button'),
    ).find(
      (item) =>
        item.textContent?.trim() === name ||
        item.getAttribute('aria-label') === name,
    ) as HTMLButtonElement;
  }

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('standard modal', () => {
    beforeEach(() => setup());

    it('should render the component with its props in a modal at the end of the body', async () => {
      await service.show({ component: BodyComponent, props: { name: 'Ada' } });

      const modal = modals()[0];
      expect(modal.parentElement).toBe(document.body);
      expect(modal.querySelector('dialog')?.hasAttribute('open')).toBe(true);
      expect(modal.textContent).toContain('Hello Ada');
    });

    it('should leave out the props the component does not declare', async () => {
      await expect(
        service.show({
          component: BodyComponent,
          props: { name: 'Ada', unknown: 1 },
        }),
      ).resolves.toBeDefined();

      expect(modals()[0].textContent).toContain('Hello Ada');
    });

    it('should resolve onDidDismiss with the data the component dismissed with', async () => {
      const modal = await service.show({ component: BodyComponent });

      button('Pick').click();

      await expect(modal.onDidDismiss()).resolves.toEqual({ data: 'picked' });
      expect(modals()).toHaveLength(0);
    });

    it('should close the modal through the dismiss of the returned modal', async () => {
      const modal = await service.show({ component: BodyComponent });

      modal.dismiss(42);

      await expect(modal.onDidDismiss()).resolves.toEqual({ data: 42 });
      expect(modals()).toHaveLength(0);
    });

    it('should close the modal opened last through the service dismiss', async () => {
      const first = await service.show({
        component: BodyComponent,
        props: { name: 'first' },
      });
      const second = await service.show({
        component: BodyComponent,
        props: { name: 'second' },
      });
      const firstDismissed = jest.fn();
      void first.onDidDismiss().then(firstDismissed);

      await service.dismiss('top');

      await expect(second.onDidDismiss()).resolves.toEqual({ data: 'top' });
      expect(firstDismissed).not.toHaveBeenCalled();
      expect(modals().map((modal) => modal.textContent)).toEqual([
        expect.stringContaining('Hello first'),
      ]);
    });

    it('should let the component close its modal through the injected service', async () => {
      const modal = await service.show({ component: ServiceBodyComponent });

      button('Close me').click();

      await expect(modal.onDidDismiss()).resolves.toEqual({
        data: 'from-service',
      });
    });

    it('should resolve with null data when the close button closes the modal', async () => {
      const modal = await service.show({ component: BodyComponent });

      button('Close').click();

      await expect(modal.onDidDismiss()).resolves.toEqual({ data: null });
      expect(modals()).toHaveLength(0);
    });

    it('should add the css classes and the bottom class for the bottom mode', async () => {
      await service.show({
        component: BodyComponent,
        mode: 'bottom',
        cssClass: ['my-modal'],
      });

      const modal = modals()[0];
      const dialog = modal.querySelector('dialog');
      expect(modal.getAttribute('data-mode')).toBe('bottom');
      expect(dialog?.classList).toContain('my-modal');
      expect(dialog?.classList).toContain('smart-modal-bottom');
    });

    it('should open the bottom mode as the bottom-sheet variant', async () => {
      await service.show({ component: BodyComponent, mode: 'bottom' });

      const dialog = modals()[0].querySelector('dialog');
      expect(dialog?.getAttribute('data-variant')).toBe('bottom-sheet');
      expect(dialog?.classList).toContain('smart:bottom-0');
      expect(dialog?.classList).toContain('smart:max-h-[85dvh]');
    });

    it('should open the default mode without a variant', async () => {
      await service.show({ component: BodyComponent, cssClass: ['my-modal'] });

      const dialog = modals()[0].querySelector('dialog');
      expect(dialog?.hasAttribute('data-variant')).toBe(false);
      expect(dialog?.className).toBe('my-modal');
    });

    it('should resolve the dependencies of the component from the given injector', async () => {
      const injector = Injector.create({
        providers: [{ provide: GREETING, useValue: 'Hi from the opener' }],
      });

      await service.show({ component: InjectedBodyComponent, injector });

      expect(modals()[0].textContent).toContain('Hi from the opener');
    });

    it('should give the focus back to the element focused before', async () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus();
      const modal = await service.show({ component: BodyComponent });
      button('Pick').focus();

      modal.dismiss();

      expect(document.activeElement).toBe(trigger);
    });
  });

  describe('preset modal', () => {
    beforeEach(() =>
      setup([
        {
          provide: MODAL_STANDARD_COMPONENT_TOKEN,
          useValue: ModalPresetComponent,
        },
      ]),
    );

    function backdrop(): HTMLElement {
      return document.body.querySelector(
        'smart-modal [role="presentation"]',
      ) as HTMLElement;
    }

    async function render(): Promise<void> {
      appRef.tick();
      await new Promise((resolve) => setTimeout(resolve));
      appRef.tick();
    }

    it('should render the component in the registered modal', async () => {
      await service.show({ component: BodyComponent, props: { name: 'Ada' } });
      await render();

      expect(backdrop()).toBeTruthy();
      expect(
        backdrop().querySelector('[role="dialog"]')?.textContent,
      ).toContain('Hello Ada');
    });

    it('should resolve with null data when the backdrop is clicked', async () => {
      const modal = await service.show({ component: BodyComponent });
      await render();

      backdrop().click();

      await expect(modal.onDidDismiss()).resolves.toEqual({ data: null });
    });

    it('should resolve with null data on Escape', async () => {
      const modal = await service.show({ component: BodyComponent });
      await render();

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );

      await expect(modal.onDidDismiss()).resolves.toEqual({ data: null });
    });

    it('should stay open on a backdrop click and Escape without backdropDismiss', async () => {
      const modal = await service.show({
        component: BodyComponent,
        backdropDismiss: false,
      });
      const dismissed = jest.fn();
      void modal.onDidDismiss().then(dismissed);
      await render();

      backdrop().click();
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      await render();

      expect(dismissed).not.toHaveBeenCalled();
      expect(backdrop()).toBeTruthy();
    });

    it('should render the bottom mode as a bottom sheet', async () => {
      await service.show({
        component: BodyComponent,
        props: { name: 'Ada' },
        mode: 'bottom',
      });
      await render();

      const panel = backdrop().querySelector('[role="dialog"]') as HTMLElement;
      const wrapper = panel.parentElement as HTMLElement;
      expect(wrapper.classList).toContain('smart:bottom-0');
      expect(wrapper.classList).toContain('smart-modal-bottom');
      expect(panel.classList).toContain('smart:sm:rounded-t-xl');
      expect(panel.textContent).toContain('Hello Ada');
    });

    it('should close the bottom sheet on a backdrop click', async () => {
      const modal = await service.show({
        component: BodyComponent,
        mode: 'bottom',
      });
      await render();

      backdrop().click();

      await expect(modal.onDidDismiss()).resolves.toEqual({ data: null });
    });

    it('should still close on its close button without backdropDismiss', async () => {
      const modal = await service.show({
        component: BodyComponent,
        backdropDismiss: false,
      });
      await render();

      button('Close').click();

      await expect(modal.onDidDismiss()).resolves.toEqual({ data: null });
    });
  });
});
