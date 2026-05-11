import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroupStandardComponent } from './standard.component';
import { IButtonGroupButton } from '../../../models';

describe('@smartsoft001/shared-angular: ButtonGroupStandardComponent', () => {
  let fixture: ComponentFixture<ButtonGroupStandardComponent>;
  let component: ButtonGroupStandardComponent;

  const buttons: IButtonGroupButton[] = [
    { id: 'a', label: 'Alpha' },
    { id: 'b', label: 'Bravo', count: 3 },
    { id: 'c', label: 'Charlie', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonGroupStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a host div with role="group"', () => {
    const group = fixture.nativeElement.querySelector('div[role="group"]');

    expect(group).toBeTruthy();
  });

  it('should render one <button> per item in buttons()', () => {
    fixture.componentRef.setInput('buttons', buttons);
    fixture.detectChanges();

    const buttonEls = fixture.nativeElement.querySelectorAll('button');

    expect(buttonEls.length).toBe(3);
  });

  it('should update selected() and emit buttonClick on click', () => {
    fixture.componentRef.setInput('buttons', buttons);
    fixture.detectChanges();

    const spy = jest.fn();
    component.buttonClick.subscribe(spy);

    const buttonEls: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    buttonEls[1].click();
    fixture.detectChanges();

    expect(component.selected()).toBe('b');
    expect(spy).toHaveBeenCalledWith({ buttonId: 'b' });
  });

  it('should reflect selected() via aria-pressed attribute', () => {
    fixture.componentRef.setInput('buttons', buttons);
    fixture.componentRef.setInput('selected', 'a');
    fixture.detectChanges();

    const buttonEls: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );

    expect(buttonEls[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttonEls[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('should honor the disabled flag on individual buttons', () => {
    fixture.componentRef.setInput('buttons', buttons);
    fixture.detectChanges();

    const buttonEls: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );

    expect(buttonEls[2].disabled).toBe(true);
    expect(buttonEls[0].disabled).toBe(false);
  });

  it('should render the count when provided', () => {
    fixture.componentRef.setInput('buttons', buttons);
    fixture.detectChanges();

    const countEls = fixture.nativeElement.querySelectorAll(
      '.smart-button-group-count',
    );

    expect(countEls.length).toBe(1);
    expect(countEls[0].textContent.trim()).toBe('3');
  });

  it('should apply cssClass to the host div', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('div[role="group"]');

    expect(group.className).toContain('my-extra-class');
  });
});
