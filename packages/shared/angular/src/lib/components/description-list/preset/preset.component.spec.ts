import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionListPresetComponent } from './preset.component';
import { IDescriptionListOptions } from '../../../models';

describe('@smartsoft001/shared-angular: DescriptionListPresetComponent', () => {
  describe('structure and cssClass', () => {
    let fixture: ComponentFixture<DescriptionListPresetComponent>;
    let component: DescriptionListPresetComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DescriptionListPresetComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(DescriptionListPresetComponent);
      component = fixture.componentInstance;
    });

    function setOptions(options: IDescriptionListOptions): void {
      fixture.componentRef.setInput('options', options);
      fixture.detectChanges();
    }

    function query(selector: string): HTMLElement | null {
      return (fixture.nativeElement as HTMLElement).querySelector(selector);
    }

    it('should create an instance', () => {
      fixture.detectChanges();

      expect(component).toBeInstanceOf(DescriptionListPresetComponent);
    });

    it('should always render the list zone', () => {
      fixture.detectChanges();

      expect(query('[data-role="list"]')).toBeTruthy();
    });

    it('should render the header when title is provided', () => {
      setOptions({ title: 'Applicant Information' });

      const header = query('[data-role="header"]');

      expect(header?.textContent).toContain('Applicant Information');
    });

    it('should render the header when description is provided', () => {
      setOptions({ description: 'Personal details and application.' });

      const header = query('[data-role="header"]');

      expect(header?.textContent).toContain(
        'Personal details and application.',
      );
    });

    it('should not render the header when neither title nor description are set', () => {
      setOptions({ items: [{ label: 'Full name', value: 'Margot Foster' }] });

      expect(query('[data-role="header"]')).toBeNull();
    });

    it('should merge the canonical cssClass onto the list zone', () => {
      fixture.componentRef.setInput('cssClass', 'my-extra-class');
      fixture.detectChanges();

      const list = query('[data-role="list"]');

      expect(list?.className).toContain('my-extra-class');
    });

    it('should keep its own preset classes when cssClass is merged', () => {
      fixture.componentRef.setInput('cssClass', 'my-extra-class');
      fixture.detectChanges();

      const list = query('[data-role="list"]');

      expect(list?.className).toContain('smart:divide-y');
    });
  });

  describe('items, templates and zones', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #valueTpl>
          <span class="custom-value">Custom value content</span>
        </ng-template>
        <ng-template #actionTpl>
          <button class="action-btn">Update</button>
        </ng-template>
        <ng-template #attachmentsTpl>
          <ul class="attachments-list">
            <li>resume.pdf</li>
          </ul>
        </ng-template>
        <ng-template #footerTpl>
          <button class="footer-btn">Read full application</button>
        </ng-template>
        <smart-description-list-preset [options]="options" />
      `,
      imports: [DescriptionListPresetComponent],
    })
    class TestHostComponent {
      @ViewChild('valueTpl', { static: true }) valueTpl!: TemplateRef<unknown>;
      @ViewChild('actionTpl', { static: true })
      actionTpl!: TemplateRef<unknown>;
      @ViewChild('attachmentsTpl', { static: true })
      attachmentsTpl!: TemplateRef<unknown>;
      @ViewChild('footerTpl', { static: true })
      footerTpl!: TemplateRef<unknown>;

      options: IDescriptionListOptions = {};
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

    function setOptions(options: IDescriptionListOptions): void {
      host.options = options;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
    }

    function query(selector: string): HTMLElement | null {
      return (fixture.nativeElement as HTMLElement).querySelector(selector);
    }

    function queryAll(selector: string): NodeListOf<HTMLElement> {
      return (fixture.nativeElement as HTMLElement).querySelectorAll(selector);
    }

    it('should render one row per item with its term and value', () => {
      setOptions({
        items: [
          { label: 'Full name', value: 'Margot Foster' },
          { label: 'Application for', value: 'Backend Developer' },
        ],
      });

      const rows = queryAll('[data-role="row"]');

      expect(rows.length).toBe(2);
      expect(query('[data-role="term"]')?.textContent).toContain('Full name');
      expect(query('[data-role="value"]')?.textContent).toContain(
        'Margot Foster',
      );
    });

    it('should render valueTpl content instead of value when both are provided', () => {
      setOptions({
        items: [
          {
            label: 'Full name',
            value: 'Margot Foster',
            valueTpl: host.valueTpl,
          },
        ],
      });

      const value = query('[data-role="value"]');

      expect(value?.querySelector('span.custom-value')).toBeTruthy();
      expect(value?.textContent).not.toContain('Margot Foster');
    });

    it('should render actionTpl inside the action zone', () => {
      setOptions({
        items: [
          {
            label: 'Full name',
            value: 'Margot Foster',
            actionTpl: host.actionTpl,
          },
        ],
      });

      const action = query('[data-role="action"] button.action-btn');

      expect(action).toBeTruthy();
    });

    it('should not render the action zone when actionTpl is absent', () => {
      setOptions({
        items: [{ label: 'Full name', value: 'Margot Foster' }],
      });

      expect(query('[data-role="action"]')).toBeNull();
    });

    it('should render the attachments zone when attachmentsTpl is provided', () => {
      setOptions({ attachmentsTpl: host.attachmentsTpl });

      const attachments = query(
        '[data-role="attachments"] ul.attachments-list',
      );

      expect(attachments).toBeTruthy();
    });

    it('should not render the attachments zone when attachmentsTpl is absent', () => {
      setOptions({ items: [{ label: 'Full name', value: 'Margot Foster' }] });

      expect(query('[data-role="attachments"]')).toBeNull();
    });

    it('should render the footer zone when footerTpl is provided', () => {
      setOptions({ footerTpl: host.footerTpl });

      const footer = query('[data-role="footer"] button.footer-btn');

      expect(footer).toBeTruthy();
    });

    it('should not render the footer zone when footerTpl is absent', () => {
      setOptions({ items: [{ label: 'Full name', value: 'Margot Foster' }] });

      expect(query('[data-role="footer"]')).toBeNull();
    });
  });
});
