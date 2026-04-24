import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStrengthBaseComponent } from './base.component';

@Component({
  selector: 'smart-test-password-strength',
  template: '',
})
class TestPasswordStrengthComponent extends PasswordStrengthBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-password-strength
    [passwordToCheck]="password"
    [showHint]="showHint"
    [class]="cssClass"
    (passwordStrength)="onStrength($event)"
  />`,
  imports: [TestPasswordStrengthComponent],
})
class TestHostComponent {
  password = '';
  showHint = false;
  cssClass = '';
  emissions: boolean[] = [];
  onStrength(value: boolean): void {
    this.emissions.push(value);
  }
}

describe('@smartsoft001/shared-angular: PasswordStrengthBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestPasswordStrengthComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    host.password = '';
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  async function setPassword(value: string): Promise<void> {
    host.password = value;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create an instance when extended', () => {
    expect(directive).toBeInstanceOf(PasswordStrengthBaseComponent);
  });

  it('should have smartType static equal to "password-strength"', () => {
    expect(PasswordStrengthBaseComponent.smartType).toBe('password-strength');
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'custom-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('custom-class');
  });

  it('should report strength 0 for empty password', () => {
    expect(directive.strength()).toBe(0);
  });

  it('should report strengthIndex 3 for empty password', () => {
    expect(directive.strengthIndex()).toBe(3);
  });

  it('should report empty msg for empty password', () => {
    expect(directive.msg()).toBe('');
  });

  it('should report all result flags false for empty password', () => {
    const result = directive.result();

    expect(result).toEqual({
      lowerLetters: false,
      upperLetters: false,
      symbols: false,
      passLength: false,
    });
  });

  it('should report strength 10 for short password "abc"', async () => {
    await setPassword('abc');

    expect(directive.strength()).toBe(10);
  });

  it('should report strengthIndex 0 for short password "abc"', async () => {
    await setPassword('abc');

    expect(directive.strengthIndex()).toBe(0);
  });

  it('should report msg "poor" for short password "abc"', async () => {
    await setPassword('abc');

    expect(directive.msg()).toBe('poor');
  });

  it('should report strength 20 for medium password "Abcdefgh"', async () => {
    await setPassword('Abcdefgh');

    expect(directive.strength()).toBe(20);
  });

  it('should report strengthIndex 1 for medium password "Abcdefgh"', async () => {
    await setPassword('Abcdefgh');

    expect(directive.strengthIndex()).toBe(1);
  });

  it('should report msg "notGood" for medium password "Abcdefgh"', async () => {
    await setPassword('Abcdefgh');

    expect(directive.msg()).toBe('notGood');
  });

  it('should fill only the first bar with red when strengthIndex is 0', async () => {
    await setPassword('abc');

    const bars = directive.barClasses();

    expect(bars[0]).toBe('smart:bg-red-600 smart:dark:bg-red-500');
    expect(bars[1]).toBe('smart:bg-gray-300 smart:dark:bg-gray-600');
    expect(bars[2]).toBe('smart:bg-gray-300 smart:dark:bg-gray-600');
  });

  it('should fill the first two bars with orange when strengthIndex is 1', async () => {
    await setPassword('Abcdefgh');

    const bars = directive.barClasses();

    expect(bars[0]).toBe('smart:bg-orange-500 smart:dark:bg-orange-400');
    expect(bars[1]).toBe('smart:bg-orange-500 smart:dark:bg-orange-400');
    expect(bars[2]).toBe('smart:bg-gray-300 smart:dark:bg-gray-600');
  });

  it('should fill all three bars with yellow when strengthIndex is 2', async () => {
    await setPassword('Abcdefg1!');

    const bars = directive.barClasses();

    expect(bars[0]).toBe('smart:bg-yellow-500 smart:dark:bg-yellow-400');
    expect(bars[1]).toBe('smart:bg-yellow-500 smart:dark:bg-yellow-400');
    expect(bars[2]).toBe('smart:bg-yellow-500 smart:dark:bg-yellow-400');
  });

  it('should leave all three bars gray for empty password', () => {
    const bars = directive.barClasses();

    expect(bars).toEqual([
      'smart:bg-gray-300 smart:dark:bg-gray-600',
      'smart:bg-gray-300 smart:dark:bg-gray-600',
      'smart:bg-gray-300 smart:dark:bg-gray-600',
    ]);
  });

  it('should return empty msgClass for empty password', () => {
    expect(directive.msgClass()).toBe('');
  });

  it('should return yellow msgClass for strong password', async () => {
    await setPassword('Abcdefg1!');

    expect(directive.msgClass()).toBe(
      'smart:text-yellow-600 smart:dark:text-yellow-500',
    );
  });

  it('should compose containerClasses with base only when cssClass is empty', () => {
    expect(directive.containerClasses()).toBe(
      'smart:w-1/3 max-sm:smart:w-full',
    );
  });

  it('should append cssClass to containerClasses when non-empty', async () => {
    host.cssClass = 'extra-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.containerClasses()).toBe(
      'smart:w-1/3 max-sm:smart:w-full extra-class',
    );
  });

  it('should emit true via passwordStrength output when password becomes strong', async () => {
    await setPassword('Abcdefg1!');

    expect(host.emissions).toContain(true);
  });

  it('should emit false via passwordStrength output when password transitions from strong to weak', async () => {
    await setPassword('Abcdefg1!');
    host.emissions = [];

    await setPassword('abc');

    expect(host.emissions).toContain(false);
  });
});
