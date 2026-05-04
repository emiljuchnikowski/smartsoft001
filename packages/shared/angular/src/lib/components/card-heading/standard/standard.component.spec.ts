import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHeadingStandardComponent } from './standard.component';
import { ICardHeadingOptions } from '../../../models';

describe('@smartsoft001/shared-angular: CardHeadingStandardComponent', () => {
  describe('default rendering (no options)', () => {
    let fixture: ComponentFixture<CardHeadingStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardHeadingStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CardHeadingStandardComponent);
      fixture.detectChanges();
    });

    it('should always render a content wrapper <.content>', () => {
      const content = fixture.nativeElement.querySelector('.content');

      expect(content).toBeTruthy();
    });

    it('should not render <h3> when title is missing', () => {
      const h3 = fixture.nativeElement.querySelector('h3');

      expect(h3).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const slots = fixture.nativeElement.querySelectorAll(
        '.avatar, .meta, .actions, .description',
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
    let fixture: ComponentFixture<CardHeadingStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardHeadingStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CardHeadingStandardComponent);
      fixture.detectChanges();
    });

    it('should render <h3> with options.title', () => {
      fixture.componentRef.setInput('options', { title: 'Job Postings' });
      fixture.detectChanges();

      const h3 = fixture.nativeElement.querySelector('h3');

      expect(h3.textContent).toContain('Job Postings');
    });

    it('should render description when options.description is provided', () => {
      fixture.componentRef.setInput('options', {
        title: 'Job Postings',
        description: 'Currently open',
      });
      fixture.detectChanges();

      const desc = fixture.nativeElement.querySelector('p.description');

      expect(desc.textContent).toContain('Currently open');
    });
  });

  describe('with templates', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #avatar>
          <img class="user-avatar" alt="" />
        </ng-template>
        <ng-template #actions>
          <button class="action-btn">More</button>
        </ng-template>
        <ng-template #meta>
          <span class="meta-tag">&#64;user</span>
        </ng-template>
        <smart-card-heading-standard [options]="options" />
      `,
      imports: [CardHeadingStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('avatar', { static: true }) avatar!: TemplateRef<unknown>;
      @ViewChild('actions', { static: true }) actions!: TemplateRef<unknown>;
      @ViewChild('meta', { static: true }) meta!: TemplateRef<unknown>;

      options: ICardHeadingOptions = {};
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

    it('should render metaTpl inside the content area', async () => {
      host.options = { metaTpl: host.meta };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const tag = fixture.nativeElement.querySelector(
        '.content .meta span.meta-tag',
      );

      expect(tag).toBeTruthy();
    });
  });
});
