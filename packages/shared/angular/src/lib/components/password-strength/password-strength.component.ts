import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChange,
  EventEmitter,
  Output,
} from "@angular/core";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'smart-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe
  ]
})
export class PasswordStrengthComponent implements OnChanges {
  private _colors = ["darkred", "orangered", "yellowgreen"];

  bar0!: string;
  bar1!: string;
  bar2!: string;
  msg = '';
  msgColor!: string;

  result = {
    lowerLetters: false,
    upperLetters: false,
    symbols: false,
    passLength: false
  };

  @Input() public passwordToCheck!: string;
  @Input() public showHint!: boolean;

  @Output() passwordStrength = new EventEmitter<boolean>();

  checkStrength(p = '') {
    // 1
    let force = 0;

    // 2
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const lowerLetters: boolean = !!p && (/[a-z]+/.test(p));
    const upperLetters = /[A-Z]+/.test(p);
    const symbols = regex.test(p);

    // 3
    const flags = [lowerLetters, upperLetters, symbols];

    // 4
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag ? 1 : 0;
    }

    // 5
    force += 2 * p?.length + (p?.length >= 8 ? 1 : 0);
    force += passedMatches * 10;

    // 6
    const passLength = !(!p || p?.length <= 6);
    force = !passLength ? Math.min(force, 10) : force;

    // 7
    force = passedMatches === 1 ? Math.min(force, 10) : force;
    force = passedMatches === 2 ? Math.min(force, 20) : force;
    force = passedMatches === 3 ? Math.min(force, 30) : force;

    this.result = {
      lowerLetters,
      upperLetters,
      symbols,
      passLength
    };

    return force;
  }

  async ngOnChanges(changes: { [propName: string]: SimpleChange }): Promise<void> {
    await new Promise<void>(res => res());

    if (!changes['passwordToCheck']) return;

    const password = changes['passwordToCheck'].currentValue;
    this.setBarColors(3, "#DDD");

    this.msg = '';

    if (password) {
      const c = this.getColor(this.checkStrength(password));
      this.setBarColors(c.index, c.color);
    }

    const pwdStrength = this.checkStrength(password);
    pwdStrength === 30
      ? this.passwordStrength.emit(true)
      : this.passwordStrength.emit(false);

    switch (pwdStrength) {
      case 10:
        this.msg = 'poor';
        break;
      case 20:
        this.msg = 'notGood';
        break;
      case 30:
        this.msg = 'good';
        break;
    }
  }

  private getColor(s: number) {
    let index = 0;
    if (s === 10) {
      index = 0;
    } else if (s === 20) {
      index = 1;
    } else if (s === 30) {
      index = 2;
    } else {
      index = 3;
    }

    this.msgColor = this._colors[index];

    return {
      index: index + 1,
      color: this._colors[index],
    };
  }

  private setBarColors(count: number, col: string) {
    for (let n = 0; n < count; n++) {
      (this as any)["bar" + n] = col;
    }
  }
}
