import { Location } from '@angular/common';
import {
  Component,
  input,
  Pipe,
  PipeTransform,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { PagePresetComponent } from './preset.component';
import { IPageOptions } from '../../../models';
import { AppService, HardwareService } from '../../../services';
import { PAGE_VARIANT_COMPONENTS_TOKEN } from '../../../shared.inectors';
import { PageComponent } from '../page.component';
import { PAGE_PRESET_VARIANT_COMPONENTS } from '../preset-variants';
import { PageStandardComponent } from '../standard/standard.component';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Component({
  selector: 'smart-preset-tpl-host',
  template: `
    <smart-page-preset [options]="opts()"></smart-page-preset>
    <ng-template #bannerTpl><div id="banner">banner-content</div></ng-template>
    <ng-template #breadcrumbsTpl>
      <nav id="crumbs">crumbs-content</nav>
    </ng-template>
    <ng-template #metaTpl><span id="meta">meta-content</span></ng-template>
    <ng-template #filtersTpl
      ><div id="filters">filters-content</div></ng-template
    >
    <ng-template #sidebarTpl><div id="side">side-content</div></ng-template>
    <ng-template #bodyTpl><p id="body">body-content</p></ng-template>
  `,
  imports: [PagePresetComponent],
})
class SlotsHostComponent {
  bannerTpl = viewChild<TemplateRef<unknown>>('bannerTpl');
  breadcrumbsTpl = viewChild<TemplateRef<unknown>>('breadcrumbsTpl');
  metaTpl = viewChild<TemplateRef<unknown>>('metaTpl');
  filtersTpl = viewChild<TemplateRef<unknown>>('filtersTpl');
  sidebarTpl = viewChild<TemplateRef<unknown>>('sidebarTpl');
  bodyTpl = viewChild<TemplateRef<unknown>>('bodyTpl');

  opts(): IPageOptions {
    return {
      title: 'host',
      bannerTpl: this.bannerTpl(),
      breadcrumbsTpl: this.breadcrumbsTpl(),
      metaTpl: this.metaTpl(),
      filtersTpl: this.filtersTpl(),
      sidebarTpl: this.sidebarTpl(),
      bodyTpl: this.bodyTpl(),
    };
  }
}

@Component({
  selector: 'smart-preset-wrapper-host',
  template: `
    <smart-page [options]="opts" [class]="cssClass">
      <p id="projected">projected body</p>
    </smart-page>
  `,
  imports: [PageComponent],
})
class WrapperHostComponent {
  opts: IPageOptions | null = { title: 'wrapped', variant: 'preset' };
  cssClass = '';
}

describe('@smartsoft001/shared-angular: PagePresetComponent', () => {
  const providers = [
    { provide: Location, useValue: { back: jest.fn() } },
    {
      provide: HardwareService,
      useValue: { isMobile: false, isMobileWeb: false },
    },
    { provide: AppService, useValue: {} },
  ];

  const overridePresetTranslate = () => ({
    remove: { imports: [TranslatePipe] },
    add: { imports: [MockTranslatePipe] },
  });

  describe('direct rendering', () => {
    let fixture: ComponentFixture<PagePresetComponent>;
    let component: PagePresetComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PagePresetComponent],
        providers,
      })
        .overrideComponent(PagePresetComponent, overridePresetTranslate())
        .compileComponents();

      fixture = TestBed.createComponent(PagePresetComponent);
      component = fixture.componentInstance;
    });

    it('should create an instance', () => {
      fixture.componentRef.setInput('options', { title: 'x' });
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    it('should render the page and header data-role shells', () => {
      fixture.componentRef.setInput('options', { title: 'my-title' });
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('[data-role="page"]')).toBeTruthy();
      expect(el.querySelector('[data-role="header"]')).toBeTruthy();
    });

    it('should render the translated title in an h1', () => {
      fixture.componentRef.setInput('options', { title: 'my-title' });
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;

      const heading = el.querySelector('h1[data-role="title"]');
      expect(heading).toBeTruthy();
      expect(heading?.textContent?.trim()).toBe('my-title');
    });

    it('should skip the header entirely when hideHeader is true', () => {
      fixture.componentRef.setInput('options', {
        title: 'hidden',
        hideHeader: true,
      });
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('[data-role="header"]')).toBeFalsy();
      expect(el.querySelector('[data-role="page"]')).toBeTruthy();
    });

    it('should render the back button when showBackButton is true', () => {
      fixture.componentRef.setInput('options', {
        title: 'with-back',
        showBackButton: true,
      });
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('button[data-role="back"]')).toBeTruthy();
    });

    it('should not render the back button when showBackButton is false', () => {
      fixture.componentRef.setInput('options', { title: 'no-back' });
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('button[data-role="back"]')).toBeFalsy();
    });

    it('should call inherited back() when back button is clicked', () => {
      fixture.componentRef.setInput('options', {
        title: 'with-back',
        showBackButton: true,
      });
      fixture.detectChanges();
      const backSpy = jest.spyOn(component, 'back');

      const button = (fixture.nativeElement as HTMLElement).querySelector(
        'button[data-role="back"]',
      ) as HTMLButtonElement;
      button.click();

      expect(backSpy).toHaveBeenCalledTimes(1);
    });

    it('should render a menu button unless hideMenuButton is set', () => {
      fixture.componentRef.setInput('options', { title: 'menu' });
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('button[data-role="menu-button"]')).toBeTruthy();
    });

    it('should not render the menu button when hideMenuButton is true', () => {
      fixture.componentRef.setInput('options', {
        title: 'menu',
        hideMenuButton: true,
      });
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('button[data-role="menu-button"]')).toBeFalsy();
    });

    it('should render the search input when search is provided', () => {
      const textSignal = signal<string>('current');
      const setFn = jest.fn();
      fixture.componentRef.setInput('options', {
        title: 'searchable',
        search: { text: textSignal, set: setFn },
      });
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;

      const input = el.querySelector('input') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.value).toBe('current');
    });

    it('should render one smart-button per endButton entry', () => {
      fixture.componentRef.setInput('options', {
        title: 'with-buttons',
        endButtons: [
          { icon: 'a', text: 'A' },
          { icon: 'b', text: 'B' },
        ],
      });
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelectorAll('smart-button').length).toBe(2);
    });

    it('should not throw when options is null', () => {
      fixture.componentRef.setInput(
        'options',
        null as unknown as IPageOptions | null,
      );

      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('named slots via data-role', () => {
    let fixture: ComponentFixture<SlotsHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SlotsHostComponent],
        providers,
      })
        .overrideComponent(PagePresetComponent, overridePresetTranslate())
        .compileComponents();

      fixture = TestBed.createComponent(SlotsHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it('should project bannerTpl into the banner zone', () => {
      const el = fixture.nativeElement as HTMLElement;
      const zone = el.querySelector('[data-role="banner"]');

      expect(zone).toBeTruthy();
      expect(zone?.querySelector('#banner')).toBeTruthy();
    });

    it('should project breadcrumbsTpl into the breadcrumbs zone', () => {
      const el = fixture.nativeElement as HTMLElement;
      const zone = el.querySelector('[data-role="breadcrumbs"]');

      expect(zone?.querySelector('#crumbs')).toBeTruthy();
    });

    it('should project metaTpl into the meta zone', () => {
      const el = fixture.nativeElement as HTMLElement;
      const zone = el.querySelector('[data-role="meta"]');

      expect(zone?.querySelector('#meta')).toBeTruthy();
    });

    it('should project filtersTpl into the filters zone', () => {
      const el = fixture.nativeElement as HTMLElement;
      const zone = el.querySelector('[data-role="filters"]');

      expect(zone?.querySelector('#filters')).toBeTruthy();
    });

    it('should project sidebarTpl into the sidebar zone', () => {
      const el = fixture.nativeElement as HTMLElement;
      const zone = el.querySelector('aside[data-role="sidebar"]');

      expect(zone?.querySelector('#side')).toBeTruthy();
    });

    it('should project bodyTpl into the body zone', () => {
      const el = fixture.nativeElement as HTMLElement;
      const zone = el.querySelector('[data-role="body"]');

      expect(zone?.querySelector('#body')).toBeTruthy();
      expect(zone?.querySelector('#body')?.textContent?.trim()).toBe(
        'body-content',
      );
    });
  });

  describe('override cssClass input', () => {
    it('should expose a canonical cssClass input (no class alias)', async () => {
      await TestBed.configureTestingModule({
        imports: [PagePresetComponent],
        providers,
      })
        .overrideComponent(PagePresetComponent, overridePresetTranslate())
        .compileComponents();

      const fixture = TestBed.createComponent(PagePresetComponent);
      fixture.componentRef.setInput('options', { title: 't' });
      fixture.componentRef.setInput('cssClass', 'my-external');
      fixture.detectChanges();

      expect(fixture.componentInstance.cssClass()).toBe('my-external');
    });
  });

  describe('map dispatch via PageComponent wrapper', () => {
    let fixture: ComponentFixture<WrapperHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [WrapperHostComponent],
        providers: [
          {
            provide: PAGE_VARIANT_COMPONENTS_TOKEN,
            useValue: PAGE_PRESET_VARIANT_COMPONENTS,
          },
          ...providers,
        ],
      })
        .overrideComponent(PagePresetComponent, overridePresetTranslate())
        .overrideComponent(PageStandardComponent, overridePresetTranslate())
        .compileComponents();

      fixture = TestBed.createComponent(WrapperHostComponent);
    });

    it('should render smart-page-preset when variant is preset', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('smart-page-preset')).toBeTruthy();
      expect(el.querySelector('smart-page-standard')).toBeFalsy();
    });

    it('should auto-wire projected ng-content into the preset body', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;

      const body = el.querySelector('[data-role="body"] #projected');
      expect(body).toBeTruthy();
      expect(body?.textContent?.trim()).toBe('projected body');
    });
  });
});
