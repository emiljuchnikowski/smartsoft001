import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: ButtonCustomExampleComponent', () => {
  let fixture: ComponentFixture<ButtonCustomExampleComponent>;
  let component: ButtonCustomExampleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonCustomExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the custom button with the projected label', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('.docs-button');

    expect(button).not.toBeNull();
    expect(button.textContent).toContain('Save');
  });

  it('should run the options click handler when the custom button is clicked', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('.docs-button');

    button.click();

    expect(component.saved()).toBe(true);
  });
});
