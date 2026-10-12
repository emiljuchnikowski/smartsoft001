import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDirective } from './details.directive';
import { HardwareService, ModalService } from '../../services';

@Component({
  selector: 'smart-test-details-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p data-role="body">{{ value()?.name }}</p>
    <button type="button" (click)="close()">Done</button>
  `,
})
class BodyComponent {
  private modalService = inject(ModalService);

  value = input<{ name: string }>();

  close(): void {
    void this.modalService.dismiss();
  }
}

@Component({
  selector: 'smart-test-details-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DetailsDirective],
  template: `
    <button
      type="button"
      [smartDetails]="{ component: component(), params: params, mode: mode() }"
      (smartDetailsShowed)="showed()"
      (smartDetailsDismissed)="dismissed()"
    >
      Open
    </button>
  `,
})
class HostComponent {
  component = signal<unknown>(BodyComponent);
  params = { name: 'Margot Foster' };
  mode = signal<'bottom' | 'default' | undefined>(undefined);
  showed = jest.fn();
  dismissed = jest.fn();
}

describe('@smartsoft001/angular: DetailsDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const flush = () => new Promise((resolve) => setTimeout(resolve));

  function modal(): HTMLElement | null {
    return document.body.querySelector('smart-modal');
  }

  async function open(): Promise<void> {
    fixture.nativeElement.querySelector('button').click();
    await flush();
    TestBed.inject(ApplicationRef).tick();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [ModalService, HardwareService],
    });

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should open the component in a bottom modal with the params as its value', async () => {
    await open();

    expect(modal()?.getAttribute('data-mode')).toBe('bottom');
    expect(modal()?.querySelector('[data-role="body"]')?.textContent).toBe(
      'Margot Foster',
    );
    expect(host.showed).toHaveBeenCalledTimes(1);
    expect(host.dismissed).not.toHaveBeenCalled();
  });

  it('should open the modal in the mode it is given', async () => {
    host.mode.set('default');
    fixture.detectChanges();

    await open();

    expect(modal()?.getAttribute('data-mode')).toBe('default');
  });

  it('should emit smartDetailsDismissed once the component closed the modal', async () => {
    await open();

    document.body
      .querySelector<HTMLButtonElement>('smart-modal button:not([aria-label])')
      ?.click();
    await flush();

    expect(modal()).toBeNull();
    expect(host.dismissed).toHaveBeenCalledTimes(1);
  });

  it('should close the modal when the browser goes back', async () => {
    await open();

    window.dispatchEvent(new PopStateEvent('popstate'));
    await flush();

    expect(modal()).toBeNull();
    expect(host.dismissed).toHaveBeenCalledTimes(1);
  });

  it('should stop listening to the back button once the modal is closed', async () => {
    const hardwareService = TestBed.inject(HardwareService);
    const remove = jest.fn();
    jest
      .spyOn(hardwareService, 'onBackButtonClick')
      .mockResolvedValue({ remove });
    await open();

    await TestBed.inject(ModalService).dismiss();
    await flush();

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('should open nothing without a component', async () => {
    host.component.set(null);
    fixture.detectChanges();

    await open();

    expect(modal()).toBeNull();
    expect(host.showed).not.toHaveBeenCalled();
  });
});
