import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeadingPresetComponent } from './preset.component';
import { ISectionHeadingOptions } from '../../../models';

describe('@smartsoft001/shared-angular: SectionHeadingPresetComponent', () => {
  describe('layout, mapping and cssClass', () => {
    let fixture: ComponentFixture<SectionHeadingPresetComponent>;
    let component: SectionHeadingPresetComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SectionHeadingPresetComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SectionHeadingPresetComponent);
      component = fixture.componentInstance;
    });

    function setOptions(options: ISectionHeadingOptions): void {
      fixture.componentRef.setInput('options', options);
      fixture.detectChanges();
    }

    function query(selector: string): HTMLElement | null {
      return (fixture.nativeElement as HTMLElement).querySelector(selector);
    }

    it('should create an instance', () => {
      fixture.detectChanges();

      expect(component).toBeInstanceOf(SectionHeadingPresetComponent);
    });

    it('should default to the "half" layout when presentation is missing', () => {
      setOptions({ title: 'Half' });

      const grid = query('[data-role="grid"]');

      expect(grid?.className).toContain('smart:md:grid-cols-2');
    });

    it('should use a 2-column grid for the "half" layout', () => {
      setOptions({ title: 'Half', presentation: { layout: 'half' } });

      const grid = query('[data-role="grid"]');

      expect(grid?.className).toContain('smart:md:grid-cols-2');
    });

    it('should use a 4-column grid for the "narrow" layout', () => {
      setOptions({ title: 'Narrow', presentation: { layout: 'narrow' } });

      const grid = query('[data-role="grid"]');

      expect(grid?.className).toContain('smart:md:grid-cols-4');
    });

    it('should use a 4-column grid for the "wide" layout', () => {
      setOptions({ title: 'Wide', presentation: { layout: 'wide' } });

      const grid = query('[data-role="grid"]');

      expect(grid?.className).toContain('smart:md:grid-cols-4');
    });

    it('should stack (no grid) for the "vertical" layout', () => {
      setOptions({ title: 'Vertical', presentation: { layout: 'vertical' } });

      const grid = query('[data-role="grid"]');

      expect(grid?.className).toContain('smart:space-y-4');
      expect(grid?.className).not.toContain('smart:grid-cols');
    });

    it('should render the title in an <h2>', () => {
      setOptions({ title: 'Content title' });

      const heading = query('[data-role="text"] h2');

      expect(heading?.textContent).toContain('Content title');
    });

    it('should render the description in a <p>', () => {
      setOptions({ title: 'T', description: 'Some description' });

      const paragraph = query('[data-role="text"] p');

      expect(paragraph?.textContent).toContain('Some description');
    });

    it('should render the label as the eyebrow row', () => {
      setOptions({ title: 'T', label: 'New feature' });

      const eyebrow = query('[data-role="eyebrow"]');

      expect(eyebrow?.textContent).toContain('New feature');
    });

    it('should not render the eyebrow row when label and badge are absent', () => {
      setOptions({ title: 'T' });

      const eyebrow = query('[data-role="eyebrow"]');

      expect(eyebrow).toBeNull();
    });

    it('should not render the image zone when imageTpl is absent', () => {
      setOptions({ title: 'T', presentation: { layout: 'half' } });

      const image = query('[data-role="image"]');

      expect(image).toBeNull();
    });

    it('should merge the external cssClass onto the section element', () => {
      fixture.componentRef.setInput('cssClass', 'my-extra-class');
      setOptions({ title: 'T' });

      const section = query('[data-role="section"]');

      expect(section?.className).toContain('my-extra-class');
    });
  });

  describe('with templates', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #image>
          <img class="hero-img" src="/hero.png" alt="" />
        </ng-template>
        <ng-template #badge>
          <span class="badge-pill">Beta</span>
        </ng-template>
        <ng-template #actions>
          <button class="action-btn">Learn more</button>
        </ng-template>
        <smart-section-heading-preset [options]="options" />
      `,
      imports: [SectionHeadingPresetComponent],
    })
    class TestHostComponent {
      @ViewChild('image', { static: true }) image!: TemplateRef<unknown>;
      @ViewChild('badge', { static: true }) badge!: TemplateRef<unknown>;
      @ViewChild('actions', { static: true }) actions!: TemplateRef<unknown>;

      options: ISectionHeadingOptions = {};
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
    });

    function setOptions(options: ISectionHeadingOptions): void {
      host.options = options;
      fixture.detectChanges();
    }

    function query(selector: string): HTMLElement | null {
      return (fixture.nativeElement as HTMLElement).querySelector(selector);
    }

    it('should render the image zone when imageTpl is provided', () => {
      setOptions({ title: 'T', imageTpl: host.image });

      const img = query('[data-role="image"] img.hero-img');

      expect(img).toBeTruthy();
    });

    it('should render the image before the text for the "wide" layout', () => {
      setOptions({
        title: 'T',
        imageTpl: host.image,
        presentation: { layout: 'wide' },
      });

      const grid = query('[data-role="grid"]')!;
      const roles = Array.from(grid.children).map((c) =>
        c.getAttribute('data-role'),
      );

      expect(roles.indexOf('image')).toBeLessThan(roles.indexOf('text'));
    });

    it('should render the text before the image for the "half" layout', () => {
      setOptions({
        title: 'T',
        imageTpl: host.image,
        presentation: { layout: 'half' },
      });

      const grid = query('[data-role="grid"]')!;
      const roles = Array.from(grid.children).map((c) =>
        c.getAttribute('data-role'),
      );

      expect(roles.indexOf('text')).toBeLessThan(roles.indexOf('image'));
    });

    it('should render the badge template inside the eyebrow row', () => {
      setOptions({ title: 'T', badgeTpl: host.badge });

      const badge = query('[data-role="eyebrow"] span.badge-pill');

      expect(badge).toBeTruthy();
    });

    it('should render the actions template below the text', () => {
      setOptions({ title: 'T', actionsTpl: host.actions });

      const btn = query('[data-role="actions"] button.action-btn');

      expect(btn).toBeTruthy();
    });
  });
});
