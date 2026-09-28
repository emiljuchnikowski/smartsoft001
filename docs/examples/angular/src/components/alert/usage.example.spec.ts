import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: AlertUsageExampleComponent', () => {
  let fixture: ComponentFixture<AlertUsageExampleComponent>;

  const openAlert = (): void => {
    const trigger: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    trigger.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the alert from the options once it is opened', () => {
    openAlert();

    const dialog: HTMLElement = fixture.nativeElement.querySelector(
      '[role="alertdialog"]',
    );
    expect(dialog.textContent).toContain('Delete file?');
    expect(dialog.textContent).toContain('This cannot be undone.');
  });

  it('should hand the chosen button to the handler and close the alert', () => {
    openAlert();
    const destructive: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-role="destructive"]',
    );

    destructive.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.lastRole()).toBe('destructive');
    expect(
      fixture.nativeElement.querySelector('[role="alertdialog"]'),
    ).toBeNull();
  });
});
