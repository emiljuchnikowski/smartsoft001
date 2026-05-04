import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedLayoutStandardComponent } from './standard.component';
import { IStackedLayoutOptions } from '../../../models';

describe('@smartsoft001/shared-angular: StackedLayoutStandardComponent', () => {
  describe('default rendering', () => {
    let fixture: ComponentFixture<StackedLayoutStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StackedLayoutStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(StackedLayoutStandardComponent);
      fixture.detectChanges();
    });

    it('should render a <header> with a <nav>', () => {
      const nav = fixture.nativeElement.querySelector('header nav');

      expect(nav).toBeTruthy();
    });

    it('should render a <main> region', () => {
      const main = fixture.nativeElement.querySelector('main');

      expect(main).toBeTruthy();
    });

    it('should not render a header section when options.headerTpl is missing', () => {
      const headers = fixture.nativeElement.querySelectorAll('header');

      expect(headers.length).toBe(1);
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
        <ng-template #headerContent>
          <h1 class="page-title">Dashboard</h1>
        </ng-template>
        <smart-stacked-layout-standard [options]="options">
          <p class="content">main</p>
        </smart-stacked-layout-standard>
      `,
      imports: [StackedLayoutStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('navContent', { static: true })
      navContent!: TemplateRef<unknown>;
      @ViewChild('headerContent', { static: true })
      headerContent!: TemplateRef<unknown>;

      options: IStackedLayoutOptions = {};
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

    it('should render options.navTpl inside the <nav>', async () => {
      host.options = { navTpl: host.navContent };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const link = fixture.nativeElement.querySelector('nav a.nav-link');

      expect(link).toBeTruthy();
    });

    it('should render options.headerTpl as a second <header>', async () => {
      host.options = { headerTpl: host.headerContent };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const headers = fixture.nativeElement.querySelectorAll('header');
      const title = fixture.nativeElement.querySelector('h1.page-title');

      expect(headers.length).toBe(2);
      expect(title).toBeTruthy();
    });
  });
});
