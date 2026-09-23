import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IAlertButton } from '@smartsoft001/angular';

import {
  AlertCustomExampleComponent,
  CustomAlertComponent,
} from './custom.example';

describe('docs-examples-angular: AlertCustomExampleComponent', () => {
  let fixture: ComponentFixture<AlertCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom alert through the wrapper instead of the standard one', () => {
    expect(element.querySelector('smart-alert docs-custom-alert')).toBeTruthy();
    expect(element.querySelector('smart-alert-standard')).toBeNull();
  });

  it('should expose the header as the accessible name of the alertdialog', () => {
    const dialog = element.querySelector('[role="alertdialog"]');
    const header = element.querySelector('.docs-alert__header');

    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-labelledby')).toBe(header?.id);
    expect(header?.textContent).toContain('Delete this record?');
  });

  it('should render one button per forwarded option with its role', () => {
    const buttons = element.querySelectorAll('.docs-alert__button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0].getAttribute('data-role')).toBe('cancel');
    expect(buttons[1].getAttribute('data-role')).toBe('destructive');
  });

  // NgComponentOutlet does not forward outputs, so the wrapper's (dismissed)
  // never fires - the emission is asserted on the custom instance itself.
  it('should run the handler and emit dismissed when the confirm button is clicked', () => {
    const alert: CustomAlertComponent = fixture.debugElement.query(
      By.directive(CustomAlertComponent),
    ).componentInstance;
    const emitted: Array<IAlertButton | null> = [];
    alert.dismissed.subscribe((button) => emitted.push(button));

    element
      .querySelectorAll<HTMLButtonElement>('.docs-alert__button')[1]
      .click();

    expect(fixture.componentInstance.deleted).toBe(true);
    expect(emitted.map((button) => button?.text)).toEqual(['Delete']);
  });

  it('should emit the cancel button on Escape without running the confirm handler', () => {
    const alert: CustomAlertComponent = fixture.debugElement.query(
      By.directive(CustomAlertComponent),
    ).componentInstance;
    const emitted: Array<IAlertButton | null> = [];
    alert.dismissed.subscribe((button) => emitted.push(button));

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );

    expect(fixture.componentInstance.deleted).toBe(false);
    expect(emitted.map((button) => button?.role)).toEqual(['cancel']);
  });
});
