import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedStandardComponent } from './standard.component';
import { IFeedOptions } from '../../../models';

describe('@smartsoft001/shared-angular: FeedStandardComponent', () => {
  describe('default rendering (no options)', () => {
    let fixture: ComponentFixture<FeedStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FeedStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(FeedStandardComponent);
      fixture.detectChanges();
    });

    it('should always render the wrapper', () => {
      const wrapper = fixture.nativeElement.querySelector('.feed');

      expect(wrapper).toBeTruthy();
    });

    it('should not render <ol role="list"> when no events are provided', () => {
      const ol = fixture.nativeElement.querySelector('ol[role="list"]');

      expect(ol).toBeNull();
    });

    it('should apply external cssClass on the wrapper', () => {
      fixture.componentRef.setInput('class', 'my-extra-class');
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

      expect(wrapper.className).toContain('my-extra-class');
    });
  });

  describe('with title and description', () => {
    let fixture: ComponentFixture<FeedStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FeedStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(FeedStandardComponent);
      fixture.detectChanges();
    });

    it('should render <h3 class="title"> with options.title', () => {
      fixture.componentRef.setInput('options', { title: 'Activity' });
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('.feed > h3.title');

      expect(title.textContent).toContain('Activity');
    });

    it('should render <p class="description"> with options.description (top-level)', () => {
      fixture.componentRef.setInput('options', {
        title: 'Activity',
        description: 'Recent project events.',
      });
      fixture.detectChanges();

      const desc = fixture.nativeElement.querySelector('.feed > p.description');

      expect(desc.textContent).toContain('Recent project events.');
    });
  });

  describe('with events and templates', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #iconTpl>
          <svg class="custom-icon"></svg>
        </ng-template>
        <ng-template #emptyTpl>
          <p class="empty-msg">Brak aktywności</p>
        </ng-template>
        <ng-template #commentSubmitTpl>
          <form class="comment-form">
            <textarea></textarea>
          </form>
        </ng-template>
        <ng-template #footerTpl>
          <button class="footer-btn">Load more</button>
        </ng-template>
        <smart-feed-standard [options]="options" />
      `,
      imports: [FeedStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('iconTpl', { static: true }) iconTpl!: TemplateRef<unknown>;
      @ViewChild('emptyTpl', { static: true }) emptyTpl!: TemplateRef<unknown>;
      @ViewChild('commentSubmitTpl', { static: true })
      commentSubmitTpl!: TemplateRef<unknown>;
      @ViewChild('footerTpl', { static: true })
      footerTpl!: TemplateRef<unknown>;

      options: IFeedOptions = {};
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

    it('should render one <li.event> per events entry', async () => {
      host.options = {
        events: [
          { id: '1', title: 'Created invoice' },
          { id: '2', title: 'Sent invoice' },
          { id: '3', title: 'Paid invoice' },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const events = fixture.nativeElement.querySelectorAll('li.event');

      expect(events.length).toBe(3);
    });

    it('should render event.title inside <span class="title"> when no href', async () => {
      host.options = { events: [{ title: 'Created invoice' }] };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const titleSpan = fixture.nativeElement.querySelector(
        'li.event span.title',
      );

      expect(titleSpan.textContent).toContain('Created invoice');
    });

    it('should render event.title as <a> with href when event.href provided', async () => {
      host.options = {
        events: [{ title: 'Created invoice', href: '/invoice/1' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const link = fixture.nativeElement.querySelector('li.event a.title');

      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('/invoice/1');
    });

    it('should render <time class="timestamp"> when event.timestamp provided', async () => {
      host.options = {
        events: [{ title: 'Created invoice', timestamp: '2026-01-23T10:32' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const time = fixture.nativeElement.querySelector(
        'li.event time.timestamp',
      );

      expect(time.textContent).toContain('2026-01-23T10:32');
    });

    it('should render <img class="avatar"> when avatarUrl provided and no iconTpl', async () => {
      host.options = {
        events: [{ title: 'Comment', avatarUrl: '/img/u.jpg' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const img = fixture.nativeElement.querySelector('li.event img.avatar');

      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('/img/u.jpg');
    });

    it('should render iconTpl winning over avatarUrl when both provided', async () => {
      host.options = {
        events: [
          {
            title: 'Action',
            avatarUrl: '/img/u.jpg',
            iconTpl: host.iconTpl,
          },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = fixture.nativeElement.querySelector(
        'li.event span.icon svg.custom-icon',
      );
      const img = fixture.nativeElement.querySelector('li.event img.avatar');

      expect(icon).toBeTruthy();
      expect(img).toBeNull();
    });

    it('should render comments under the event when comments provided', async () => {
      host.options = {
        events: [
          {
            title: 'Discussion',
            comments: [
              { authorName: 'Lindsay', content: 'Looking good' },
              {
                authorName: 'Tom',
                content: 'Approved',
                timestamp: '3d ago',
                authorAvatarUrl: '/img/tom.jpg',
              },
            ],
          },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const comments = fixture.nativeElement.querySelectorAll(
        'li.event ul.comments li.comment',
      );

      expect(comments.length).toBe(2);
      expect(comments[0].querySelector('.author').textContent).toContain(
        'Lindsay',
      );
      expect(comments[0].querySelector('.content').textContent).toContain(
        'Looking good',
      );
      expect(comments[1].querySelector('img.avatar').getAttribute('src')).toBe(
        '/img/tom.jpg',
      );
      expect(comments[1].querySelector('time.timestamp').textContent).toContain(
        '3d ago',
      );
    });

    it('should render emptyTpl when events is empty', async () => {
      host.options = { events: [], emptyTpl: host.emptyTpl };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const empty = fixture.nativeElement.querySelector('.empty p.empty-msg');

      expect(empty).toBeTruthy();
    });

    it('should render commentSubmitTpl inside <.comment-submit>', async () => {
      host.options = { commentSubmitTpl: host.commentSubmitTpl };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const form = fixture.nativeElement.querySelector(
        '.comment-submit form.comment-form',
      );

      expect(form).toBeTruthy();
    });

    it('should render footerTpl inside <.footer>', async () => {
      host.options = { footerTpl: host.footerTpl };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const btn = fixture.nativeElement.querySelector(
        '.footer button.footer-btn',
      );

      expect(btn).toBeTruthy();
    });

    it('should set aria-label on <li> when event.ariaLabel provided', async () => {
      host.options = {
        events: [{ title: 'Hello', ariaLabel: 'Greeting event' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const li = fixture.nativeElement.querySelector('li.event');

      expect(li.getAttribute('aria-label')).toBe('Greeting event');
    });
  });
});
