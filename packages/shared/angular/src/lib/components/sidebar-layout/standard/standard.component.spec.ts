import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLayoutStandardComponent } from './standard.component';
import { ISidebarLayoutOptions } from '../../../models';

describe('@smartsoft001/shared-angular: SidebarLayoutStandardComponent', () => {
  describe('default rendering', () => {
    let fixture: ComponentFixture<SidebarLayoutStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SidebarLayoutStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SidebarLayoutStandardComponent);
      fixture.detectChanges();
    });

    it('should render an <aside> region', () => {
      const aside = fixture.nativeElement.querySelector('aside');

      expect(aside).toBeTruthy();
    });

    it('should render a <main> region', () => {
      const main = fixture.nativeElement.querySelector('main');

      expect(main).toBeTruthy();
    });

    it('should not render a <header> when options.headerTpl is missing', () => {
      const header = fixture.nativeElement.querySelector('header');

      expect(header).toBeNull();
    });

    it('should apply external cssClass on the wrapper', () => {
      fixture.componentRef.setInput('class', 'my-extra-class');
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

      expect(wrapper.className).toContain('my-extra-class');
    });

    it('should place <aside> before <main> by default (left sidebar)', () => {
      const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;
      const children = Array.from(wrapper.children) as HTMLElement[];
      const asideIndex = children.findIndex((c) => c.tagName === 'ASIDE');
      const mainIndex = children.findIndex((c) => c.tagName === 'MAIN');

      expect(asideIndex).toBeLessThan(mainIndex);
    });
  });

  describe('with templates and right sidebar', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #sidebarContent>
          <a class="nav-link">Home</a>
        </ng-template>
        <ng-template #headerContent>
          <h1 class="page-title">Dashboard</h1>
        </ng-template>
        <smart-sidebar-layout-standard [options]="options">
          <p class="content">main</p>
        </smart-sidebar-layout-standard>
      `,
      imports: [SidebarLayoutStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('sidebarContent', { static: true })
      sidebarContent!: TemplateRef<unknown>;
      @ViewChild('headerContent', { static: true })
      headerContent!: TemplateRef<unknown>;

      options: ISidebarLayoutOptions = {};
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

    it('should project ng-content into <main>', () => {
      const main = fixture.nativeElement.querySelector('main');

      expect(main.textContent).toContain('main');
    });

    it('should render options.sidebarTpl inside the <aside>', async () => {
      host.options = { sidebarTpl: host.sidebarContent };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const link = fixture.nativeElement.querySelector('aside a.nav-link');

      expect(link).toBeTruthy();
    });

    it('should render <header> with options.headerTpl when provided', async () => {
      host.options = { headerTpl: host.headerContent };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const title = fixture.nativeElement.querySelector('header h1.page-title');

      expect(title).toBeTruthy();
    });

    it('should place <aside> after <main> when sidebarPosition is right', async () => {
      host.options = { sidebarPosition: 'right' };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const wrapper = fixture.nativeElement.querySelector(
        'smart-sidebar-layout-standard',
      ).firstElementChild as HTMLElement;
      const children = Array.from(wrapper.children) as HTMLElement[];
      const asideIndex = children.findIndex((c) => c.tagName === 'ASIDE');
      const mainIndex = children.findIndex((c) => c.tagName === 'MAIN');

      expect(mainIndex).toBeLessThan(asideIndex);
    });
  });
});
