import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  ButtonGroupCustomExampleComponent,
  CustomButtonGroupComponent,
} from './custom.example';

describe('docs-examples-angular: ButtonGroupCustomExampleComponent', () => {
  let fixture: ComponentFixture<ButtonGroupCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonGroupCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom button group with the pre-selected button', () => {
    const group = fixture.nativeElement.querySelector('.docs-button-group');
    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.docs-button-group__button');

    expect(group).not.toBeNull();
    expect(buttons.length).toBe(3);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(
      fixture.nativeElement.querySelector('smart-button-group-standard'),
    ).toBeNull();
  });

  it('should select the clicked button and emit buttonClick', () => {
    const group: CustomButtonGroupComponent = fixture.debugElement.query(
      By.directive(CustomButtonGroupComponent),
    ).componentInstance;
    const emitted: string[] = [];
    group.buttonClick.subscribe((event) => emitted.push(event.buttonId));

    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.docs-button-group__button');
    buttons[2].click();
    fixture.detectChanges();

    expect(emitted).toEqual(['date']);
    expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
  });
});
