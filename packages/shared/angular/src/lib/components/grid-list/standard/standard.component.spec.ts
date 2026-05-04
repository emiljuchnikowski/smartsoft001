import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridListStandardComponent } from './standard.component';
import { IGridListOptions } from '../../../models';

describe('@smartsoft001/shared-angular: GridListStandardComponent', () => {
  describe('default rendering (no options)', () => {
    let fixture: ComponentFixture<GridListStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GridListStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(GridListStandardComponent);
      fixture.detectChanges();
    });

    it('should always render the wrapper', () => {
      const wrapper = fixture.nativeElement.querySelector('.grid-list');

      expect(wrapper).toBeTruthy();
    });

    it('should not render <ul role="list"> when no items are provided', () => {
      const ul = fixture.nativeElement.querySelector('ul[role="list"]');

      expect(ul).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const slots = fixture.nativeElement.querySelectorAll(
        '.title, .description, .footer, .item, .icon, .image, .badge, .action, .empty',
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
    let fixture: ComponentFixture<GridListStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GridListStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(GridListStandardComponent);
      fixture.detectChanges();
    });

    it('should render <h3 class="title"> with options.title', () => {
      fixture.componentRef.setInput('options', { title: 'Team' });
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('h3.title');

      expect(title.textContent).toContain('Team');
    });

    it('should render <p class="description"> with options.description', () => {
      fixture.componentRef.setInput('options', {
        title: 'Team',
        description: 'Active project members.',
      });
      fixture.detectChanges();

      const desc = fixture.nativeElement.querySelector('p.description');

      expect(desc.textContent).toContain('Active project members.');
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
          <span class="custom-badge">New</span>
        </ng-template>
        <ng-template #actionTpl>
          <button class="action-btn">Open</button>
        </ng-template>
        <ng-template #emptyTpl>
          <p class="empty-msg">Brak rekordów</p>
        </ng-template>
        <ng-template #footerTpl>
          <button class="footer-btn">Load more</button>
        </ng-template>
        <smart-grid-list-standard [options]="options" />
      `,
      imports: [GridListStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('iconTpl', { static: true }) iconTpl!: TemplateRef<unknown>;
      @ViewChild('badgeTpl', { static: true }) badgeTpl!: TemplateRef<unknown>;
      @ViewChild('actionTpl', { static: true })
      actionTpl!: TemplateRef<unknown>;
      @ViewChild('emptyTpl', { static: true }) emptyTpl!: TemplateRef<unknown>;
      @ViewChild('footerTpl', { static: true })
      footerTpl!: TemplateRef<unknown>;

      options: IGridListOptions = {};
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
          { id: '1', title: 'Card A' },
          { id: '2', title: 'Card B' },
          { id: '3', title: 'Card C' },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const items = fixture.nativeElement.querySelectorAll('li.item');

      expect(items.length).toBe(3);
    });

    it('should render item.title inside <span class="title"> when no href', async () => {
      host.options = { items: [{ title: 'Card A' }] };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const titleSpan =
        fixture.nativeElement.querySelector('li.item span.title');

      expect(titleSpan.textContent).toContain('Card A');
    });

    it('should render item.title as <a> with href when item.href provided', async () => {
      host.options = {
        items: [{ title: 'Card A', href: '/a' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const link = fixture.nativeElement.querySelector('li.item a.title');

      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('/a');
    });

    it('should render <img class="image"> when item.imageUrl provided and no iconTpl', async () => {
      host.options = {
        items: [
          { title: 'Card A', imageUrl: '/img/a.jpg', imageAlt: 'Card A image' },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const img = fixture.nativeElement.querySelector('li.item img.image');

      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('/img/a.jpg');
      expect(img.getAttribute('alt')).toBe('Card A image');
    });

    it('should render iconTpl inside <span class="icon"> when provided (winning over imageUrl)', async () => {
      host.options = {
        items: [
          {
            title: 'Card A',
            imageUrl: '/img/a.jpg',
            iconTpl: host.iconTpl,
          },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = fixture.nativeElement.querySelector(
        'li.item span.icon svg.custom-icon',
      );
      const img = fixture.nativeElement.querySelector('li.item img.image');

      expect(icon).toBeTruthy();
      expect(img).toBeNull();
    });

    it('should render badgeTpl inside <span class="badge"> when provided', async () => {
      host.options = {
        items: [{ title: 'Card A', badgeTpl: host.badgeTpl }],
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
        items: [{ title: 'Card A', actionTpl: host.actionTpl }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const action = fixture.nativeElement.querySelector(
        'li.item span.action button.action-btn',
      );

      expect(action).toBeTruthy();
    });

    it('should render emptyTpl when items is empty', async () => {
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

    it('should set aria-label on <li> when item.ariaLabel provided', async () => {
      host.options = {
        items: [{ title: 'Card A', ariaLabel: 'Open card A' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const li = fixture.nativeElement.querySelector('li.item');

      expect(li.getAttribute('aria-label')).toBe('Open card A');
    });
  });
});
