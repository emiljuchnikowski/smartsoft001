import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiColumnLayoutStandardComponent } from './standard.component';
import { IMultiColumnLayoutOptions } from '../../../models';

describe('@smartsoft001/shared-angular: MultiColumnLayoutStandardComponent', () => {
  describe('default rendering', () => {
    let fixture: ComponentFixture<MultiColumnLayoutStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MultiColumnLayoutStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(MultiColumnLayoutStandardComponent);
      fixture.detectChanges();
    });

    it('should render two <aside> regions (nav + secondary)', () => {
      const asides = fixture.nativeElement.querySelectorAll('aside');

      expect(asides.length).toBe(2);
    });

    it('should render a <main> region', () => {
      const main = fixture.nativeElement.querySelector('main');

      expect(main).toBeTruthy();
    });

    it('should not render <header> when options.headerTpl is missing', () => {
      const header = fixture.nativeElement.querySelector('header');

      expect(header).toBeNull();
    });

    it('should place nav <aside> before <main> and secondary <aside> after <main>', () => {
      const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;
      const children = Array.from(wrapper.children) as HTMLElement[];
      const navIndex = children.findIndex(
        (c) => c.tagName === 'ASIDE' && c.classList.contains('nav'),
      );
      const mainIndex = children.findIndex((c) => c.tagName === 'MAIN');
      const secondaryIndex = children.findIndex(
        (c) => c.tagName === 'ASIDE' && c.classList.contains('secondary'),
      );

      expect(navIndex).toBeLessThan(mainIndex);
      expect(mainIndex).toBeLessThan(secondaryIndex);
    });

    it('should apply external cssClass on the wrapper', () => {
      fixture.componentRef.setInput('class', 'my-extra-class');
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

      expect(wrapper.className).toContain('my-extra-class');
    });
  });

  describe('with templates', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #navContent>
          <a class="nav-link">Home</a>
        </ng-template>
        <ng-template #secondaryContent>
          <p class="meta">meta</p>
        </ng-template>
        <ng-template #headerContent>
          <h1 class="page-title">Inbox</h1>
        </ng-template>
        <smart-multi-column-layout-standard [options]="options">
          <p class="content">main</p>
        </smart-multi-column-layout-standard>
      `,
      imports: [MultiColumnLayoutStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('navContent', { static: true })
      navContent!: TemplateRef<unknown>;
      @ViewChild('secondaryContent', { static: true })
      secondaryContent!: TemplateRef<unknown>;
      @ViewChild('headerContent', { static: true })
      headerContent!: TemplateRef<unknown>;

      options: IMultiColumnLayoutOptions = {};
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

    it('should render options.navTpl inside the nav <aside>', async () => {
      host.options = { navTpl: host.navContent };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const link = fixture.nativeElement.querySelector('aside.nav a.nav-link');

      expect(link).toBeTruthy();
    });

    it('should render options.secondaryTpl inside the secondary <aside>', async () => {
      host.options = { secondaryTpl: host.secondaryContent };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const meta = fixture.nativeElement.querySelector(
        'aside.secondary p.meta',
      );

      expect(meta).toBeTruthy();
    });

    it('should render <header> with options.headerTpl when provided', async () => {
      host.options = { headerTpl: host.headerContent };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const title = fixture.nativeElement.querySelector('header h1.page-title');

      expect(title).toBeTruthy();
    });
  });
});
