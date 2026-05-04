import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeadingStandardComponent } from './standard.component';
import { ISectionHeadingOptions } from '../../../models';

describe('@smartsoft001/shared-angular: SectionHeadingStandardComponent', () => {
  describe('default rendering (no options)', () => {
    let fixture: ComponentFixture<SectionHeadingStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SectionHeadingStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SectionHeadingStandardComponent);
      fixture.detectChanges();
    });

    it('should always render the header wrapper', () => {
      const header = fixture.nativeElement.querySelector('.header');

      expect(header).toBeTruthy();
    });

    it('should not render <h3> when title is missing', () => {
      const h3 = fixture.nativeElement.querySelector('h3');

      expect(h3).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const slots = fixture.nativeElement.querySelectorAll(
        '.actions, .tabs, .input-group, .badge, .description, .label',
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

  describe('with title, label and description', () => {
    let fixture: ComponentFixture<SectionHeadingStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SectionHeadingStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SectionHeadingStandardComponent);
      fixture.detectChanges();
    });

    it('should render <h3> with options.title', () => {
      fixture.componentRef.setInput('options', { title: 'Applicants' });
      fixture.detectChanges();

      const h3 = fixture.nativeElement.querySelector('h3');

      expect(h3.textContent).toContain('Applicants');
    });

    it('should render label inside <h3> when options.label is provided', () => {
      fixture.componentRef.setInput('options', {
        title: 'Applicants',
        label: 'in Engineering',
      });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('h3 span.label');

      expect(label.textContent).toContain('in Engineering');
    });

    it('should render description when options.description is provided', () => {
      fixture.componentRef.setInput('options', {
        title: 'Applicants',
        description: 'Users currently active',
      });
      fixture.detectChanges();

      const desc = fixture.nativeElement.querySelector('p.description');

      expect(desc.textContent).toContain('Users currently active');
    });
  });

  describe('with templates', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #actions>
          <button class="action-btn">Add</button>
        </ng-template>
        <ng-template #tabs>
          <a class="tab-link">All</a>
        </ng-template>
        <ng-template #inputGroup>
          <input class="search-input" />
        </ng-template>
        <ng-template #badge>
          <span class="badge-pill">New</span>
        </ng-template>
        <smart-section-heading-standard [options]="options" />
      `,
      imports: [SectionHeadingStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('actions', { static: true }) actions!: TemplateRef<unknown>;
      @ViewChild('tabs', { static: true }) tabs!: TemplateRef<unknown>;
      @ViewChild('inputGroup', { static: true })
      inputGroup!: TemplateRef<unknown>;
      @ViewChild('badge', { static: true }) badge!: TemplateRef<unknown>;

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
      fixture.detectChanges();
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

    it('should render tabsTpl in <.tabs>', async () => {
      host.options = { tabsTpl: host.tabs };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const tab = fixture.nativeElement.querySelector('.tabs a.tab-link');

      expect(tab).toBeTruthy();
    });

    it('should render inputGroupTpl in <.input-group>', async () => {
      host.options = { inputGroupTpl: host.inputGroup };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const input = fixture.nativeElement.querySelector(
        '.input-group input.search-input',
      );

      expect(input).toBeTruthy();
    });

    it('should render badgeTpl in <.badge>', async () => {
      host.options = { badgeTpl: host.badge };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const badge = fixture.nativeElement.querySelector(
        '.badge span.badge-pill',
      );

      expect(badge).toBeTruthy();
    });
  });
});
