import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ButtonUsageExampleComponent', () => {
  let fixture: ComponentFixture<ButtonUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the projected label as a button of the configured type', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    expect(button.textContent).toContain('Save changes');
    expect(button.type).toBe('submit');
  });

  it('should run the click handler from the options', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    button.click();

    expect(fixture.componentInstance.saveCount()).toBe(1);
  });
});
