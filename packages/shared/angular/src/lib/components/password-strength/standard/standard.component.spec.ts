import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { PasswordStrengthStandardComponent } from './standard.component';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('@smartsoft001/shared-angular: PasswordStrengthStandardComponent', () => {
  let fixture: ComponentFixture<PasswordStrengthStandardComponent>;
  let element: HTMLElement;

  async function createComponent(
    passwordToCheck: string,
    showHint: boolean,
    cssClass?: string,
  ): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthStandardComponent],
    })
      .overrideComponent(PasswordStrengthStandardComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthStandardComponent);
    fixture.componentRef.setInput('passwordToCheck', passwordToCheck);
    fixture.componentRef.setInput('showHint', showHint);
    if (cssClass !== undefined) {
      fixture.componentRef.setInput('class', cssClass);
    }
    fixture.detectChanges();
    element = fixture.nativeElement;
  }

  it('should render three bar <li> elements', async () => {
    await createComponent('', false);

    const bars = element.querySelectorAll('ul > li');

    expect(bars.length).toBe(3);
  });

  it('should apply the gray empty-bar class to all three bars when password is empty', async () => {
    await createComponent('', false);

    const bars = element.querySelectorAll('ul > li');

    expect(bars[0].getAttribute('class')).toContain('smart:bg-gray-300');
    expect(bars[1].getAttribute('class')).toContain('smart:bg-gray-300');
    expect(bars[2].getAttribute('class')).toContain('smart:bg-gray-300');
  });

  it('should apply red filled class to first bar for a weak password and gray to the other two', async () => {
    await createComponent('abc', false);

    const bars = element.querySelectorAll('ul > li');

    expect(bars[0].getAttribute('class')).toContain('smart:bg-red-600');
    expect(bars[1].getAttribute('class')).toContain('smart:bg-gray-300');
    expect(bars[2].getAttribute('class')).toContain('smart:bg-gray-300');
  });

  it('should apply orange filled class to first two bars for a medium password and gray to the third', async () => {
    await createComponent('Abcdefgh', false);

    const bars = element.querySelectorAll('ul > li');

    expect(bars[0].getAttribute('class')).toContain('smart:bg-orange-500');
    expect(bars[1].getAttribute('class')).toContain('smart:bg-orange-500');
    expect(bars[2].getAttribute('class')).toContain('smart:bg-gray-300');
  });

  it('should apply yellow filled class to all three bars for a strong password', async () => {
    await createComponent('Abcdefg1!', false);

    const bars = element.querySelectorAll('ul > li');

    expect(bars[0].getAttribute('class')).toContain('smart:bg-yellow-500');
    expect(bars[1].getAttribute('class')).toContain('smart:bg-yellow-500');
    expect(bars[2].getAttribute('class')).toContain('smart:bg-yellow-500');
  });

  it('should NOT render the message <p> when password is empty', async () => {
    await createComponent('', false);

    const p = element.querySelector('p');

    expect(p).toBeNull();
  });

  it('should render the message <p> with the poor translation key for a weak password', async () => {
    await createComponent('abc', false);

    const p = element.querySelector('p');

    expect(p!.textContent).toContain('INPUT.PASSWORD-STRENGTH.poor');
  });

  it('should render the message <p> with the notGood translation key for a medium password', async () => {
    await createComponent('Abcdefgh', false);

    const p = element.querySelector('p');

    expect(p!.textContent).toContain('INPUT.PASSWORD-STRENGTH.notGood');
  });

  it('should render the message <p> with the good translation key for a strong password', async () => {
    await createComponent('Abcdefg1!', false);

    const p = element.querySelector('p');

    expect(p!.textContent).toContain('INPUT.PASSWORD-STRENGTH.good');
  });

  it('should apply msgClass() to the message <p> for a weak password', async () => {
    await createComponent('abc', false);

    const p = element.querySelector('p');

    expect(p!.getAttribute('class')).toContain('smart:text-red-600');
  });

  it('should NOT render the hint list when showHint is false', async () => {
    await createComponent('', false);

    const lists = element.querySelectorAll('ul');

    expect(lists.length).toBe(1);
  });

  it('should render the hint list with all 4 items when showHint is true and password is empty', async () => {
    await createComponent('', true);

    const lists = element.querySelectorAll('ul');
    const hintItems = lists[1].querySelectorAll('li');

    expect(hintItems.length).toBe(4);
  });

  it('should hide invalidMinLength hint when password length > 6', async () => {
    await createComponent('abcdefg', true);

    const lists = element.querySelectorAll('ul');
    const hintText = lists[1].textContent ?? '';

    expect(hintText).not.toContain('INPUT.ERRORS.invalidMinLength');
  });

  it('should hide upperLetters hint when password contains an uppercase letter', async () => {
    await createComponent('A', true);

    const lists = element.querySelectorAll('ul');
    const hintText = lists[1].textContent ?? '';

    expect(hintText).not.toContain('INPUT.ERRORS.upperLetters');
  });

  it('should hide lowerLetters hint when password contains a lowercase letter', async () => {
    await createComponent('a', true);

    const lists = element.querySelectorAll('ul');
    const hintText = lists[1].textContent ?? '';

    expect(hintText).not.toContain('INPUT.ERRORS.lowerLetters');
  });

  it('should hide symbols hint when password contains a symbol', async () => {
    await createComponent('!', true);

    const lists = element.querySelectorAll('ul');
    const hintText = lists[1].textContent ?? '';

    expect(hintText).not.toContain('INPUT.ERRORS.symbols');
  });

  it('should append external class alias value into the outer container class attribute', async () => {
    await createComponent('', false, 'my-strength');

    const container = element.firstElementChild as HTMLElement;

    expect(container.getAttribute('class')).toContain('my-strength');
  });
});
