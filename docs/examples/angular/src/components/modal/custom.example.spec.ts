import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IModalActionClick } from '@smartsoft001/angular';

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

  it('should project the content of <smart-modal> into the custom body', () => {
    // Arrange
    const body = element.querySelector('.docs-modal__body');

    // Act
    const text = body?.textContent;

    // Assert
    expect(text).toContain('Your invoices stay available for 30 days.');
  });

  it('should emit actionClick from the custom modal and through the wrapper', () => {
    // Arrange
    const modal: CustomModalComponent = fixture.debugElement.query(
      By.directive(CustomModalComponent),
    ).componentInstance;
    const emitted: string[] = [];
    modal.actionClick.subscribe(({ actionId }: IModalActionClick) =>
      emitted.push(actionId),
    );

    // Act
    element
      .querySelectorAll<HTMLButtonElement>('.docs-modal__action')[1]
      .click();
    fixture.detectChanges();

    // Assert
    expect(emitted).toEqual(['deactivate']);
    expect(
      element.querySelector('.docs-modal__last-action')?.textContent,
    ).toContain('Last action: deactivate');
  });

  it('should hide the dialog when the custom dismiss button is clicked', () => {
    element.querySelector<HTMLButtonElement>('.docs-modal__dismiss')?.click();
    fixture.detectChanges();

    expect(element.querySelector('.docs-modal')).toBeNull();
  });
});
