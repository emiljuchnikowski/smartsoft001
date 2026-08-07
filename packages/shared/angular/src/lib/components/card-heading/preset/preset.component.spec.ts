import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHeadingPresetComponent } from './preset.component';
import { ICardHeadingOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <ng-template #avatar><img class="user-avatar" alt="" /></ng-template>
    <ng-template #meta><span class="meta-tag">&#64;user</span></ng-template>
    <ng-template #actions><button class="action-btn">More</button></ng-template>
    <smart-card-heading-preset [options]="options" [class]="cssClass" />
  `,
  imports: [CardHeadingPresetComponent],
})
class TestHostComponent {
  @ViewChild('avatar', { static: true }) avatar!: TemplateRef<unknown>;
  @ViewChild('meta', { static: true }) meta!: TemplateRef<unknown>;
  @ViewChild('actions', { static: true }) actions!: TemplateRef<unknown>;

  options: ICardHeadingOptions = {};
  cssClass = '';
}

describe('@smartsoft001/shared-angular: CardHeadingPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  function card(): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="card"]',
    ) as HTMLElement;
  }

  describe('container variants', () => {
    it('should fall back to the author variant when no presentation is set', () => {
      host.options = { title: 'Job Postings' };
      fixture.detectChanges();

      expect(card().className).toContain('smart:rounded-md');
      expect(card().className).toContain('smart:border-gray-300');
      expect(card().className).toContain('smart:dark:border-gray-600');
    });

    it('should apply the author container classes', () => {
      host.options = { title: 'A', presentation: { variant: 'author' } };
      fixture.detectChanges();

      expect(card().className).toContain('smart:rounded-md');
      expect(card().className).toContain('smart:shadow-sm');
    });

    it('should apply the stacked container classes', () => {
      host.options = { title: 'A', presentation: { variant: 'stacked' } };
      fixture.detectChanges();

      expect(card().className).toContain('smart:block');
      expect(card().className).not.toContain('smart:rounded-md');
    });

    it('should apply the overlay container classes', () => {
      host.options = { title: 'A', presentation: { variant: 'overlay' } };
      fixture.detectChanges();

      expect(card().className).toContain('smart:group');
      expect(card().className).toContain('smart:bg-black');
    });

    it('should apply the outline container classes', () => {
      host.options = { title: 'A', presentation: { variant: 'outline' } };
      fixture.detectChanges();

      expect(card().className).toContain('smart:group');
      expect(card().className).toContain('smart:h-64');
    });
  });

  describe('template slots', () => {
    beforeEach(() => {
      host.options = {
        title: 'Job Postings',
        description: 'Currently open',
        avatarTpl: host.avatar,
        metaTpl: host.meta,
        actionsTpl: host.actions,
      };
      fixture.detectChanges();
    });

    it('should render the title', () => {
      const title = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-role="title"]',
      );

      expect(title?.textContent).toContain('Job Postings');
    });

    it('should render the description', () => {
      const desc = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-role="description"]',
      );

      expect(desc?.textContent).toContain('Currently open');
    });

    it('should render the avatar slot', () => {
      const img = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-role="avatar"] img.user-avatar',
      );

      expect(img).toBeTruthy();
    });

    it('should render the meta slot', () => {
      const tag = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-role="meta"] span.meta-tag',
      );

      expect(tag).toBeTruthy();
    });

    it('should render the actions slot', () => {
      const btn = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-role="actions"] button.action-btn',
      );

      expect(btn).toBeTruthy();
    });
  });

  describe('cssClass override', () => {
    it('should merge the external cssClass into the card host classes', () => {
      host.options = { title: 'A' };
      host.cssClass = 'my-extra-class';
      fixture.detectChanges();

      expect(card().className).toContain('my-extra-class');
      expect(card().className).toContain('smart:rounded-md');
    });
  });
});
