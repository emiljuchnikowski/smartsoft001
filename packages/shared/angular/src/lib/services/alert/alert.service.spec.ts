import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { AlertBaseComponent } from '../../components/alert';
import { ALERT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-alert-mock',
  changeDetection: ChangeDetectionStrategy.Eager,
  template:
    '<button type="button" class="mock-alert" (click)="cancel()">mock</button>',
})
class MockAlertComponent extends AlertBaseComponent {}

describe('@smartsoft001/shared-angular: AlertService', () => {
  let service: AlertService;

  function dialog(): HTMLElement | null {
    return document.body.querySelector('[role="alertdialog"]');
  }

  function buttons(): HTMLButtonElement[] {
    return Array.from(
      document.body.querySelectorAll<HTMLButtonElement>(
        '[role="alertdialog"] button',
      ),
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AlertService] });

    service = TestBed.inject(AlertService);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should append the alert dialog to the document body', async () => {
    const promise = service.show({
      header: 'Confirm',
      buttons: [{ text: 'OK' }],
    });

    expect(dialog()).toBeTruthy();
    expect(dialog()?.textContent).toContain('Confirm');

    buttons()[0].click();
    await promise;
  });

  it('should run the button handler and resolve with the clicked button', async () => {
    const handler = jest.fn();
    const promise = service.show({
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Confirm', handler },
      ],
    });

    buttons()[1].click();
    const result = await promise;

    expect(handler).toHaveBeenCalled();
    expect(result).toEqual({ text: 'Confirm', handler });
  });

  it('should remove the alert dialog from the DOM after it is resolved', async () => {
    const promise = service.show({ buttons: [{ text: 'OK' }] });

    buttons()[0].click();
    await promise;

    expect(dialog()).toBeNull();
  });

  it('should resolve with the cancel button on Escape without running the confirm handler', async () => {
    const handler = jest.fn();
    const promise = service.show({
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Confirm', handler },
      ],
    });

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    const result = await promise;

    expect(handler).not.toHaveBeenCalled();
    expect(result).toEqual({ text: 'Cancel', role: 'cancel' });
  });

  it('should move focus into the dialog and restore it to the trigger afterwards', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const promise = service.show({ buttons: [{ text: 'OK' }] });

    expect(dialog()?.contains(document.activeElement)).toBe(true);

    buttons()[0].click();
    await promise;

    expect(document.activeElement).toBe(trigger);
  });

  it('should mount the component provided via ALERT_STANDARD_COMPONENT_TOKEN', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AlertService,
        {
          provide: ALERT_STANDARD_COMPONENT_TOKEN,
          useValue: MockAlertComponent,
        },
      ],
    });
    service = TestBed.inject(AlertService);

    const promise = service.show({ buttons: [{ text: 'OK' }] });
    const mock = document.body.querySelector<HTMLButtonElement>('.mock-alert');

    expect(mock).toBeTruthy();
    expect(dialog()).toBeNull();

    mock?.click();

    expect(await promise).toBeNull();
  });
});
