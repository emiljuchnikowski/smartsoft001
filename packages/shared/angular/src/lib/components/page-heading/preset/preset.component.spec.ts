import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeadingPresetComponent } from './preset.component';
import { IPageHeadingOptions } from '../../../models';

@Component({
  selector: 'smart-test-page-heading-templates',
  template: `
    <ng-template #logo><span class="logo-content">Logo</span></ng-template>
    <ng-template #nav
      ><ul class="nav-content">
        <li>Home</li>
      </ul></ng-template
    >
    <ng-template #actions><a class="actions-content">Sign in</a></ng-template>
    <ng-template #avatar><img class="avatar-content" alt="me" /></ng-template>
  `,
})
class TemplatesHostComponent {
  @ViewChild('logo', { static: true }) logo!: TemplateRef<unknown>;
  @ViewChild('nav', { static: true }) nav!: TemplateRef<unknown>;
  @ViewChild('actions', { static: true }) actions!: TemplateRef<unknown>;
  @ViewChild('avatar', { static: true }) avatar!: TemplateRef<unknown>;
}

describe('@smartsoft001/shared-angular: PageHeadingPresetComponent', () => {
  let fixture: ComponentFixture<PageHeadingPresetComponent>;
  let component: PageHeadingPresetComponent;
  let tpl: TemplatesHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeadingPresetComponent, TemplatesHostComponent],
    }).compileComponents();

    const tplFixture = TestBed.createComponent(TemplatesHostComponent);
    tplFixture.detectChanges();
    tpl = tplFixture.componentInstance;

    fixture = TestBed.createComponent(PageHeadingPresetComponent);
    component = fixture.componentInstance;
  });

  const el = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const role = (name: string): HTMLElement | null =>
    el().querySelector(`[data-role="${name}"]`);

  function render(options: IPageHeadingOptions): void {
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  }

  it('should create an instance', () => {
    render({ title: 'Acme' });

    expect(component).toBeInstanceOf(PageHeadingPresetComponent);
    expect(role('header')).toBeTruthy();
  });

  describe('layouts', () => {
    it('should default to links-left (gap-8 bar) when no layout is given', () => {
      render({
        logoTpl: tpl.logo,
        navTpl: tpl.nav,
        actionsTpl: tpl.actions,
      });

      expect(el().querySelector('.smart\\:gap-8')).toBeTruthy();
      expect(role('logo')).toBeTruthy();
      expect(role('nav')).toBeTruthy();
      expect(role('actions')).toBeTruthy();
    });

    it('should center the nav for links-center', () => {
      render({
        presentation: { layout: 'links-center' },
        logoTpl: tpl.logo,
        navTpl: tpl.nav,
        actionsTpl: tpl.actions,
      });

      expect(el().querySelector('.smart\\:md\\:justify-center')).toBeTruthy();
      expect(el().querySelector('.smart\\:gap-8')).toBeNull();
      expect(role('logo')).toBeTruthy();
      expect(role('nav')).toBeTruthy();
      expect(role('actions')).toBeTruthy();
    });

    it('should group nav + actions on the right for links-right', () => {
      render({
        presentation: { layout: 'links-right' },
        logoTpl: tpl.logo,
        navTpl: tpl.nav,
        actionsTpl: tpl.actions,
      });

      expect(el().querySelector('.smart\\:md\\:gap-12')).toBeTruthy();
      expect(role('actions')).toBeTruthy();
      expect(role('avatar')).toBeNull();
    });

    it('should render an avatar zone instead of actions for the user layout', () => {
      render({
        presentation: { layout: 'user' },
        logoTpl: tpl.logo,
        navTpl: tpl.nav,
        avatarTpl: tpl.avatar,
      });

      expect(el().querySelector('.smart\\:md\\:gap-12')).toBeTruthy();
      expect(role('avatar')).toBeTruthy();
      expect(role('actions')).toBeNull();
    });
  });

  describe('logo zone', () => {
    it('should render logoTpl content when provided', () => {
      render({ logoTpl: tpl.logo });

      expect(role('logo')?.querySelector('.logo-content')).toBeTruthy();
    });

    it('should fall back to the title text when no logoTpl is provided', () => {
      render({ title: 'Dashboard' });

      expect(role('logo')?.textContent?.trim()).toBe('Dashboard');
    });
  });

  describe('mobile menu', () => {
    it('should hide the mobile panel by default and reveal it on hamburger click', () => {
      render({ navTpl: tpl.nav, actionsTpl: tpl.actions });

      expect(role('mobile-panel')).toBeNull();

      role('hamburger')?.click();
      fixture.detectChanges();

      expect(component['menuOpened']()).toBe(true);
      expect(role('mobile-panel')).toBeTruthy();
      expect(role('mobile-panel')?.querySelector('.nav-content')).toBeTruthy();
    });
  });

  describe('cssClass', () => {
    it('should merge the canonical cssClass input onto the header', () => {
      fixture.componentRef.setInput('cssClass', 'my-extra-class');
      render({ title: 'Acme' });

      expect(role('header')?.className).toContain('my-extra-class');
      expect(role('header')?.className).toContain('smart:bg-white');
    });
  });
});
