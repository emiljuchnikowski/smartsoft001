import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeadingStandardComponent } from './standard.component';
import { IPageHeadingOptions } from '../../../models';

describe('@smartsoft001/shared-angular: PageHeadingStandardComponent', () => {
  describe('default rendering (no options)', () => {
    let fixture: ComponentFixture<PageHeadingStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PageHeadingStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(PageHeadingStandardComponent);
      fixture.detectChanges();
    });

    it('should always render a <header>', () => {
      const header = fixture.nativeElement.querySelector('header');

      expect(header).toBeTruthy();
    });

    it('should not render <h1> when title is missing', () => {
      const h1 = fixture.nativeElement.querySelector('h1');

      expect(h1).toBeNull();
    });

    it('should not render <nav.breadcrumbs> when breadcrumbsTpl is missing', () => {
      const nav = fixture.nativeElement.querySelector('nav.breadcrumbs');

      expect(nav).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const slots = fixture.nativeElement.querySelectorAll(
        '.banner, .avatar, .logo, .meta, .stats, .actions, .filters, .subtitle',
      );

      expect(slots.length).toBe(0);
    });

    it('should apply external cssClass on the wrapper', () => {
      fixture.componentRef.setInput('class', 'my-extra-class');
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

      expect(wrapper.className).toContain('my-extra-class');
    });
  });

  describe('with title and subtitle', () => {
    let fixture: ComponentFixture<PageHeadingStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PageHeadingStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(PageHeadingStandardComponent);
      fixture.detectChanges();
    });

    it('should render <h1> with options.title', () => {
      fixture.componentRef.setInput('options', { title: 'Back End Developer' });
      fixture.detectChanges();

      const h1 = fixture.nativeElement.querySelector('h1');

      expect(h1.textContent).toContain('Back End Developer');
    });

    it('should render subtitle when options.subtitle is provided', () => {
      fixture.componentRef.setInput('options', {
        title: 'Title',
        subtitle: 'Engineering',
      });
      fixture.detectChanges();

      const subtitle = fixture.nativeElement.querySelector('.subtitle');

      expect(subtitle.textContent).toContain('Engineering');
    });
  });

  describe('with templates', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #breadcrumbs>
          <a class="crumb">Home</a>
        </ng-template>
        <ng-template #avatar>
          <img class="user-avatar" alt="" />
        </ng-template>
        <ng-template #banner>
          <img class="banner-img" alt="" />
        </ng-template>
        <ng-template #actions>
          <button class="action-btn">Edit</button>
        </ng-template>
        <ng-template #meta>
          <span class="meta-tag">Full-time</span>
        </ng-template>
        <ng-template #stats>
          <dl class="stats-list"></dl>
        </ng-template>
        <ng-template #logo>
          <img class="org-logo" alt="" />
        </ng-template>
        <ng-template #filters>
          <button class="filter-btn">Status</button>
        </ng-template>
        <smart-page-heading-standard [options]="options" />
      `,
      imports: [PageHeadingStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('breadcrumbs', { static: true })
      breadcrumbs!: TemplateRef<unknown>;
      @ViewChild('avatar', { static: true }) avatar!: TemplateRef<unknown>;
      @ViewChild('banner', { static: true }) banner!: TemplateRef<unknown>;
      @ViewChild('actions', { static: true }) actions!: TemplateRef<unknown>;
      @ViewChild('meta', { static: true }) meta!: TemplateRef<unknown>;
      @ViewChild('stats', { static: true }) stats!: TemplateRef<unknown>;
      @ViewChild('logo', { static: true }) logo!: TemplateRef<unknown>;
      @ViewChild('filters', { static: true }) filters!: TemplateRef<unknown>;

      options: IPageHeadingOptions = {};
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render breadcrumbsTpl in <nav.breadcrumbs>', async () => {
      host.options = { breadcrumbsTpl: host.breadcrumbs };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const crumb = fixture.nativeElement.querySelector(
        'nav.breadcrumbs a.crumb',
      );

      expect(crumb).toBeTruthy();
    });

    it('should render avatarTpl in <.avatar>', async () => {
      host.options = { avatarTpl: host.avatar };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const img = fixture.nativeElement.querySelector(
        '.avatar img.user-avatar',
      );

      expect(img).toBeTruthy();
    });

    it('should render bannerTpl in <.banner>', async () => {
      host.options = { bannerTpl: host.banner };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const img = fixture.nativeElement.querySelector('.banner img.banner-img');

      expect(img).toBeTruthy();
    });

    it('should render actionsTpl in <.actions>', async () => {
      host.options = { actionsTpl: host.actions };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const btn = fixture.nativeElement.querySelector(
        '.actions button.action-btn',
      );

      expect(btn).toBeTruthy();
    });

    it('should render metaTpl, statsTpl, logoTpl and filtersTpl when provided', async () => {
      host.options = {
        metaTpl: host.meta,
        statsTpl: host.stats,
        logoTpl: host.logo,
        filtersTpl: host.filters,
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        fixture.nativeElement.querySelector('.meta span.meta-tag'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('.stats dl.stats-list'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('.logo img.org-logo'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('.filters button.filter-btn'),
      ).toBeTruthy();
    });
  });
});
