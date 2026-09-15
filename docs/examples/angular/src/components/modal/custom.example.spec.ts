import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CustomModalComponent,
  ModalCustomExampleComponent,
} from './custom.example';

describe('docs-examples-angular: ModalCustomExampleComponent', () => {
  let fixture: ComponentFixture<ModalCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom modal through the wrapper instead of the standard one', () => {
    expect(element.querySelector('smart-modal docs-custom-modal')).toBeTruthy();
    expect(element.querySelector('smart-modal-standard')).toBeNull();
  });

  it('should render the forwarded title and description', () => {
    expect(element.querySelector('.docs-modal__title')?.textContent).toContain(
      'Deactivate account',
    );
    expect(
      element.querySelector('.docs-modal__description')?.textContent,
    ).toContain('permanently removed');
  });

  it('should render one footer button per forwarded action', () => {
    const actions = element.querySelectorAll('.docs-modal__action');

    expect(actions).toHaveLength(2);
    expect(actions[1].getAttribute('data-variant')).toBe('danger');
  });

  // NgComponentOutlet does not forward outputs, so the wrapper's (actionClick)
  // never fires - the emission is asserted on the custom instance itself.
  it('should emit actionClick with the action id when an action is clicked', () => {
    const modal: CustomModalComponent = fixture.debugElement.query(
      By.directive(CustomModalComponent),
    ).componentInstance;
    const emitted: string[] = [];
    modal.actionClick.subscribe(({ actionId }: { actionId: string }) =>
      emitted.push(actionId),
    );

    element
      .querySelectorAll<HTMLButtonElement>('.docs-modal__action')[1]
      .click();

    expect(emitted).toEqual(['deactivate']);
  });

  it('should hide the dialog when the custom dismiss button is clicked', () => {
    element.querySelector<HTMLButtonElement>('.docs-modal__dismiss')?.click();
    fixture.detectChanges();

    expect(element.querySelector('.docs-modal')).toBeNull();
  });
});
