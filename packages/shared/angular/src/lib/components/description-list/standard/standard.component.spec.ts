import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionListStandardComponent } from './standard.component';
import { IDescriptionListOptions } from '../../../models';

describe('@smartsoft001/shared-angular: DescriptionListStandardComponent', () => {
  describe('default rendering (no options)', () => {
    let fixture: ComponentFixture<DescriptionListStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DescriptionListStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(DescriptionListStandardComponent);
      fixture.detectChanges();
    });

    it('should always render the list wrapper', () => {
      const list = fixture.nativeElement.querySelector('.list');

      expect(list).toBeTruthy();
    });

    it('should always render a <dl> element', () => {
      const dl = fixture.nativeElement.querySelector('dl');

      expect(dl).toBeTruthy();
    });

    it('should not render any <dt> when no items are provided', () => {
      const dt = fixture.nativeElement.querySelector('dt');

      expect(dt).toBeNull();
    });

    it('should not render any <dd> when no items are provided', () => {
      const dd = fixture.nativeElement.querySelector('dd');

      expect(dd).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const slots = fixture.nativeElement.querySelectorAll(
        '.title, .description, .attachments, .footer, .item, .action',
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
    let fixture: ComponentFixture<DescriptionListStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DescriptionListStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(DescriptionListStandardComponent);
      fixture.detectChanges();
    });

    it('should render <h3 class="title"> with options.title', () => {
      fixture.componentRef.setInput('options', {
        title: 'Applicant Information',
      });
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('h3.title');

      expect(title.textContent).toContain('Applicant Information');
    });

    it('should render <p class="description"> with options.description', () => {
      fixture.componentRef.setInput('options', {
        title: 'Applicant Information',
        description: 'Personal details and application.',
      });
      fixture.detectChanges();

      const desc = fixture.nativeElement.querySelector('p.description');

      expect(desc.textContent).toContain('Personal details and application.');
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

  describe('with templates (items + slots)', () => {
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
        <smart-description-list-standard [options]="options" />
      `,
      imports: [DescriptionListStandardComponent],
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

    it('should render <dt> with item.label and <dd> with item.value', async () => {
      host.options = {
        items: [{ label: 'Full name', value: 'Margot Foster' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const dt = fixture.nativeElement.querySelector('.item dt');
      const dd = fixture.nativeElement.querySelector('.item dd');

      expect(dt.textContent).toContain('Full name');
      expect(dd.textContent).toContain('Margot Foster');
    });

    it('should render one <.item> per items entry', async () => {
      host.options = {
        items: [
          { label: 'Full name', value: 'Margot Foster' },
          { label: 'Application for', value: 'Backend Developer' },
          { label: 'Email address', value: 'margotfoster@example.com' },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const items = fixture.nativeElement.querySelectorAll('.item');

      expect(items.length).toBe(3);
    });

    it('should render valueTpl content inside <dd> when provided instead of value', async () => {
      host.options = {
        items: [{ label: 'Full name', valueTpl: host.valueTpl }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const customValue = fixture.nativeElement.querySelector(
        '.item dd span.custom-value',
      );

      expect(customValue).toBeTruthy();
      expect(customValue.textContent).toContain('Custom value content');
    });

    it('should render actionTpl inside <span class="action"> next to value', async () => {
      host.options = {
        items: [
          {
            label: 'Full name',
            value: 'Margot Foster',
            actionTpl: host.actionTpl,
          },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const action = fixture.nativeElement.querySelector(
        '.item dd span.action button.action-btn',
      );

      expect(action).toBeTruthy();
    });

    it('should render attachmentsTpl inside <.attachments>', async () => {
      host.options = { attachmentsTpl: host.attachmentsTpl };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const list = fixture.nativeElement.querySelector(
        '.attachments ul.attachments-list',
      );

      expect(list).toBeTruthy();
    });

    it('should render footerTpl inside <.footer>', async () => {
      host.options = { footerTpl: host.footerTpl };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const footerBtn = fixture.nativeElement.querySelector(
        '.footer button.footer-btn',
      );

      expect(footerBtn).toBeTruthy();
    });
  });
});
