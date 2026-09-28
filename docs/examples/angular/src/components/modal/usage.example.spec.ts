import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ModalUsageExampleComponent', () => {
  let fixture: ComponentFixture<ModalUsageExampleComponent>;
  let element: HTMLElement;

  const dialog = () => element.querySelector('dialog') as HTMLDialogElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should open the modal when the trigger is clicked', () => {
    element.querySelector<HTMLButtonElement>('.docs-modal-trigger')?.click();
    fixture.detectChanges();

    expect(dialog().open).toBe(true);
    expect(dialog().textContent).toContain('Deactivate account');
    expect(dialog().textContent).toContain('permanently removed');
  });

  it('should hand the clicked action id to the handler', () => {
    const deactivate = Array.from(
      dialog().querySelectorAll<HTMLButtonElement>('footer button'),
    ).find((button) => button.textContent?.includes('Deactivate'));

    deactivate?.click();

    expect(fixture.componentInstance.lastAction()).toBe('deactivate');
  });

  it('should run the closed handler and close the modal on dismiss', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    dialog().querySelector<HTMLButtonElement>('.smart-modal-dismiss')?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(fixture.componentInstance.closedCount()).toBe(1);
  });
});
