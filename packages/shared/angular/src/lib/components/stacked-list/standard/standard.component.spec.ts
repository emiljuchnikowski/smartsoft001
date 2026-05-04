import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedListStandardComponent } from './standard.component';
import { IStackedListOptions } from '../../../models';

describe('@smartsoft001/shared-angular: StackedListStandardComponent', () => {
  describe('default rendering (no options)', () => {
    let fixture: ComponentFixture<StackedListStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StackedListStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(StackedListStandardComponent);
      fixture.detectChanges();
    });

    it('should always render the wrapper', () => {
      const wrapper = fixture.nativeElement.querySelector('.stacked-list');

      expect(wrapper).toBeTruthy();
    });

    it('should not render <ul role="list"> when no items are provided', () => {
      const list = fixture.nativeElement.querySelector('ul[role="list"]');

      expect(list).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const slots = fixture.nativeElement.querySelectorAll(
        '.title, .description, .footer, .item, .action, .badge, .icon, .empty',
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

  describe('with title and description', () => {
    let fixture: ComponentFixture<StackedListStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StackedListStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(StackedListStandardComponent);
      fixture.detectChanges();
    });

    it('should render <h3 class="title"> with options.title', () => {
      fixture.componentRef.setInput('options', {
        title: 'Team members',
      });
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('h3.title');

      expect(title.textContent).toContain('Team members');
    });

    it('should render <p class="description"> with options.description', () => {
      fixture.componentRef.setInput('options', {
        title: 'Team members',
        description: 'Active project members.',
      });
      fixture.detectChanges();

      const desc = fixture.nativeElement.querySelector('p.description');

      expect(desc.textContent).toContain('Active project members.');
    });

    it('should not render <h3.title> when options.title is missing', () => {
      fixture.componentRef.setInput('options', {
        description: 'Only description',
      });
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('h3.title');

      expect(title).toBeNull();
    });
  });

  describe('with items and templates', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #iconTpl>
          <svg class="custom-icon"></svg>
        </ng-template>
        <ng-template #badgeTpl>
          <span class="custom-badge">Active</span>
        </ng-template>
        <ng-template #actionTpl>
          <button class="action-btn">View</button>
        </ng-template>
        <ng-template #emptyTpl>
          <p class="empty-msg">No members yet</p>
        </ng-template>
        <ng-template #footerTpl>
          <button class="footer-btn">Load more</button>
        </ng-template>
        <smart-stacked-list-standard [options]="options" />
      `,
      imports: [StackedListStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('iconTpl', { static: true }) iconTpl!: TemplateRef<unknown>;
      @ViewChild('badgeTpl', { static: true }) badgeTpl!: TemplateRef<unknown>;
      @ViewChild('actionTpl', { static: true })
      actionTpl!: TemplateRef<unknown>;
      @ViewChild('emptyTpl', { static: true }) emptyTpl!: TemplateRef<unknown>;
      @ViewChild('footerTpl', { static: true })
      footerTpl!: TemplateRef<unknown>;

      options: IStackedListOptions = {};
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

    it('should render one <li.item> per items entry', async () => {
      host.options = {
        items: [
          { id: '1', title: 'Lindsay Walton' },
          { id: '2', title: 'Courtney Henry' },
          { id: '3', title: 'Tom Cook' },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const items = fixture.nativeElement.querySelectorAll('li.item');

      expect(items.length).toBe(3);
    });

    it('should render item.title inside <span class="title"> when no href', async () => {
      host.options = { items: [{ title: 'Lindsay Walton' }] };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const titleSpan =
        fixture.nativeElement.querySelector('li.item span.title');

      expect(titleSpan.textContent).toContain('Lindsay Walton');
    });

    it('should render item.title as <a> with href when item.href provided', async () => {
      host.options = {
        items: [{ title: 'Lindsay Walton', href: '/team/lindsay' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const link = fixture.nativeElement.querySelector('li.item a.title');

      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('/team/lindsay');
      expect(link.textContent).toContain('Lindsay Walton');
    });

    it('should render item.description and item.meta when provided', async () => {
      host.options = {
        items: [
          {
            title: 'Lindsay Walton',
            description: 'Front-end Developer',
            meta: 'Joined 2026-01-12',
          },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const desc = fixture.nativeElement.querySelector('li.item .description');
      const meta = fixture.nativeElement.querySelector('li.item .meta');

      expect(desc.textContent).toContain('Front-end Developer');
      expect(meta.textContent).toContain('Joined 2026-01-12');
    });

    it('should render <img class="avatar"> when item.avatarUrl is provided and no iconTpl', async () => {
      host.options = {
        items: [{ title: 'Lindsay Walton', avatarUrl: '/img/lindsay.jpg' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const img = fixture.nativeElement.querySelector('li.item img.avatar');

      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('/img/lindsay.jpg');
    });

    it('should render iconTpl inside <span class="icon"> when provided', async () => {
      host.options = {
        items: [{ title: 'Lindsay Walton', iconTpl: host.iconTpl }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = fixture.nativeElement.querySelector(
        'li.item span.icon svg.custom-icon',
      );

      expect(icon).toBeTruthy();
    });

    it('should render badgeTpl inside <span class="badge"> when provided', async () => {
      host.options = {
        items: [{ title: 'Lindsay Walton', badgeTpl: host.badgeTpl }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const badge = fixture.nativeElement.querySelector(
        'li.item span.badge span.custom-badge',
      );

      expect(badge).toBeTruthy();
    });

    it('should render actionTpl inside <span class="action"> when provided', async () => {
      host.options = {
        items: [{ title: 'Lindsay Walton', actionTpl: host.actionTpl }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const action = fixture.nativeElement.querySelector(
        'li.item span.action button.action-btn',
      );

      expect(action).toBeTruthy();
    });

    it('should render emptyTpl when no items and emptyTpl provided', async () => {
      host.options = { items: [], emptyTpl: host.emptyTpl };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const empty = fixture.nativeElement.querySelector('.empty p.empty-msg');

      expect(empty).toBeTruthy();
    });

    it('should render footerTpl inside <.footer> when provided', async () => {
      host.options = { footerTpl: host.footerTpl };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const footerBtn = fixture.nativeElement.querySelector(
        '.footer button.footer-btn',
      );

      expect(footerBtn).toBeTruthy();
    });

    it('should set aria-label on <li> when item.ariaLabel is provided', async () => {
      host.options = {
        items: [{ title: 'Lindsay Walton', ariaLabel: 'Team member: Lindsay' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const li = fixture.nativeElement.querySelector('li.item');

      expect(li.getAttribute('aria-label')).toBe('Team member: Lindsay');
    });
  });
});
