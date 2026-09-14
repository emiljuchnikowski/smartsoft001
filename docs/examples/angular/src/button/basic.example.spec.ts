import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonBasicExampleComponent } from './basic.example';

describe('docs-examples-angular: ButtonBasicExampleComponent', () => {
  let fixture: ComponentFixture<ButtonBasicExampleComponent>;
  let component: ButtonBasicExampleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonBasicExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonBasicExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a button with the projected "Save" label', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button.textContent).toContain('Save');
  });

  it('should set saved to true when the button is clicked', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    button.click();

    expect(component.saved()).toBe(true);
  });
});
