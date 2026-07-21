import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFormPresetComponent } from './preset.component';
import {
  ISignInFormOptions,
  ISignInFormSocialClick,
  ISignInFormSubmit,
  SmartSignInFormMode,
} from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <ng-template #icon><span class="social-icon">G</span></ng-template>
    <ng-template #extra><span class="extra-slot">Terms</span></ng-template>
    <smart-sign-in-form-preset
      [mode]="mode"
      [disabled]="disabled"
      [options]="options"
      [cssClass]="cssClass"
    />
  `,
  imports: [SignInFormPresetComponent],
})
class TestHostComponent {
  @ViewChild('icon', { static: true }) icon!: TemplateRef<unknown>;
  @ViewChild('extra', { static: true }) extra!: TemplateRef<unknown>;
  @ViewChild(SignInFormPresetComponent, { static: true })
  preset!: SignInFormPresetComponent;

  mode: SmartSignInFormMode = 'sign-in';
  disabled = false;
  options: ISignInFormOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: SignInFormPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  function role(name: string): HTMLElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector(
      `[data-role="${name}"]`,
    );
  }

  describe('layouts', () => {
    it('should default to the simple single-column layout', () => {
      host.options = {};
      fixture.detectChanges();

      const container = role('container') as HTMLElement;
      expect(container.className).toContain('smart:max-w-sm');
      expect(container.className).toContain('smart:mx-auto');
      expect(role('form')).toBeTruthy();
      expect(role('email')).toBeTruthy();
      expect(role('password')).toBeTruthy();
    });

    it('should render labeled fields for the simple layout', () => {
      host.options = { layout: 'simple' };
      fixture.detectChanges();

      const labels = (fixture.nativeElement as HTMLElement).querySelectorAll(
        'label',
      );
      expect(labels.length).toBe(2);
    });

    it('should hide labels for the simple-no-labels layout', () => {
      host.options = { layout: 'simple-no-labels' };
      fixture.detectChanges();

      const labels = (fixture.nativeElement as HTMLElement).querySelectorAll(
        'label',
      );
      expect(labels.length).toBe(0);
    });

    it('should render placeholders for the simple-no-labels layout', () => {
      host.options = {
        layout: 'simple-no-labels',
        emailPlaceholder: 'you@example.com',
      };
      fixture.detectChanges();

      const email = role('email') as HTMLInputElement;
      expect(email.getAttribute('placeholder')).toBe('you@example.com');
    });

    it('should wrap the form in a card for the card layout', () => {
      host.options = { layout: 'card' };
      fixture.detectChanges();

      const card = role('card') as HTMLElement;
      expect(card).toBeTruthy();
      expect(card.className).toContain('smart:rounded-xl');
      expect(card.className).toContain('smart:border');
      expect(card.className).toContain('smart:bg-white');
    });

    it('should render a hero column for the split-screen layout', () => {
      host.options = {
        layout: 'split-screen',
        heroImageUrl: 'https://example.com/hero.jpg',
      };
      fixture.detectChanges();

      const container = role('container') as HTMLElement;
      expect(container.className).toContain('smart:grid');
      expect(container.className).toContain('smart:lg:grid-cols-2');

      const hero = role('hero') as HTMLElement;
      expect(hero).toBeTruthy();
      const img = hero.querySelector('img') as HTMLImageElement;
      expect(img.getAttribute('src')).toBe('https://example.com/hero.jpg');
    });
  });

  describe('submit', () => {
    it('should emit submit with email/password/mode on submit', () => {
      host.options = {};
      fixture.detectChanges();

      const emitted: ISignInFormSubmit[] = [];
      host.preset.submit.subscribe((v) => emitted.push(v));

      const email = role('email') as HTMLInputElement;
      const password = role('password') as HTMLInputElement;
      email.value = 'lindsay@example.com';
      email.dispatchEvent(new Event('input'));
      password.value = 'secret';
      password.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      (role('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

      expect(emitted).toEqual([
        {
          email: 'lindsay@example.com',
          password: 'secret',
          mode: 'sign-in',
        },
      ]);
    });

    it('should NOT emit submit when disabled', () => {
      host.options = {};
      host.disabled = true;
      fixture.detectChanges();

      const emitted: ISignInFormSubmit[] = [];
      host.preset.submit.subscribe((v) => emitted.push(v));

      (role('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

      expect(emitted.length).toBe(0);
    });
  });

  describe('social providers', () => {
    it('should emit socialClick with providerId+mode on click', () => {
      host.options = {
        socialProviders: [{ id: 'google', label: 'Google' }],
      };
      fixture.detectChanges();

      const emitted: ISignInFormSocialClick[] = [];
      host.preset.socialClick.subscribe((v) => emitted.push(v));

      (role('social') as HTMLButtonElement).click();

      expect(emitted).toEqual([{ providerId: 'google', mode: 'sign-in' }]);
    });
  });

  describe('mode reactivity', () => {
    it('should label the submit button "Sign in" in sign-in mode', () => {
      host.options = {};
      host.mode = 'sign-in';
      fixture.detectChanges();

      expect((role('submit') as HTMLElement).textContent?.trim()).toBe(
        'Sign in',
      );
    });

    it('should label the submit button "Sign up" in sign-up mode', () => {
      host.options = {};
      host.mode = 'sign-up';
      fixture.detectChanges();

      expect((role('submit') as HTMLElement).textContent?.trim()).toBe(
        'Sign up',
      );
    });

    it('should render the sign-up alt-link in sign-in mode', () => {
      host.mode = 'sign-in';
      host.options = { signUpHref: '/signup' };
      fixture.detectChanges();

      const link = role('alt-link') as HTMLAnchorElement;
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('/signup');
    });
  });

  describe('slots', () => {
    it('should render the extra slot', () => {
      host.options = { extraTpl: host.extra };
      fixture.detectChanges();

      const extra = role('extra') as HTMLElement;
      expect(extra.querySelector('.extra-slot')).toBeTruthy();
    });
  });

  describe('cssClass override', () => {
    it('should merge the external cssClass into the container classes', () => {
      host.options = {};
      host.cssClass = 'my-extra-class';
      fixture.detectChanges();

      const container = role('container') as HTMLElement;
      expect(container.className).toContain('my-extra-class');
      expect(container.className).toContain('smart:max-w-sm');
    });
  });
});
