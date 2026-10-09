import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ModalUsageExampleComponent', () => {
  let fixture: ComponentFixture<ModalUsageExampleComponent>;
  let element: HTMLElement;

  const dialog = () => element.querySelector('dialog') as HTMLDialogElement;
  const trigger = () =>
    Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.trim() === 'Deactivate account',
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should keep the modal closed until the trigger is clicked', () => {
    // Act
    const opened = dialog().open;

    // Assert
    expect(opened).toBe(false);
    expect(element.textContent).toContain('Last action: none');
  });

  it('should open the modal when the trigger is clicked', () => {
    // Act
    trigger()?.click();
    fixture.detectChanges();

    // Assert
    expect(dialog().open).toBe(true);
    expect(dialog().textContent).toContain('Deactivate account');
    expect(dialog().textContent).toContain('permanently removed');
  });

  it('should show the clicked action and close the modal', () => {
    // Arrange
    trigger()?.click();
    fixture.detectChanges();
    const deactivate = Array.from(
      dialog().querySelectorAll<HTMLButtonElement>('footer button'),
    ).find((button) => button.textContent?.includes('Deactivate'));

    // Act
    deactivate?.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Last action: deactivate');
    expect(element.textContent).toContain('Closed by the user: 0');
    expect(dialog().open).toBe(false);
  });

  it('should count the dismissal and close the modal', () => {
    // Arrange
    trigger()?.click();
    fixture.detectChanges();

    // Act
    dialog().querySelector<HTMLButtonElement>('.smart-modal-dismiss')?.click();
    fixture.detectChanges();

    // Assert
    expect(dialog().open).toBe(false);
    expect(element.textContent).toContain('Closed by the user: 1');
  });
});
