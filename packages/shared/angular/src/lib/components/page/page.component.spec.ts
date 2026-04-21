import { Location } from '@angular/common';
import {
  Component,
  input,
  Pipe,
  PipeTransform,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { IPageOptions, SmartPageVariant } from '../../models';
import { AppService, HardwareService } from '../../services';
import { PAGE_VARIANT_COMPONENTS_TOKEN } from '../../shared.inectors';
import { PageBaseComponent } from './base/base.component';
import { PageComponent } from './page.component';
import { PageStandardComponent } from './standard/standard.component';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Component({
  selector: 'smart-test-injected-page',
  template: '<section class="injected">injected</section>',
})
class MockInjectedPageComponent extends PageBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

@Component({
  selector: 'smart-page-host',
  template: `
    <smart-page [options]="opts" [class]="cssClass">
      <p id="projected">projected body</p>
    </smart-page>
  `,
  imports: [PageComponent],
})
class HostComponent {
  opts: IPageOptions | null = { title: 'hello' };
  cssClass = '';
}

@Component({
  selector: 'smart-page-tpl-host',
  template: `
    <smart-page [options]="buildOpts()">
      <p id="projected">projected body</p>
    </smart-page>
    <ng-template #customBody>
      <p id="explicit">explicit body</p>
    </ng-template>
  `,
  imports: [PageComponent],
})
class TplHostComponent {
  customBody = viewChild<TemplateRef<unknown>>('customBody');

  buildOpts(): IPageOptions {
    return { title: 'with-tpl', bodyTpl: this.customBody() };
  }
}

describe('@smartsoft001/shared-angular: PageComponent', () => {
  const defaultOptions: IPageOptions = { title: 'hello' };

  describe('without token (default standard)', () => {
    let fixture: ComponentFixture<PageComponent>;
    let component: PageComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PageComponent],
        providers: [
          { provide: Location, useValue: { back: jest.fn() } },
          {
            provide: HardwareService,
            useValue: { isMobile: false, isMobileWeb: false },
          },
          { provide: AppService, useValue: {} },
        ],
      })
        .overrideComponent(PageStandardComponent, {
          remove: { imports: [TranslatePipe] },
          add: { imports: [MockTranslatePipe] },
        })
        .compileComponents();

      fixture = TestBed.createComponent(PageComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('options', defaultOptions);
      fixture.detectChanges();
    });

    it('should render smart-page-standard by default (no token, no variant)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-page-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should pass options on the input signal', () => {
      const opts: IPageOptions = { title: 'another', showBackButton: true };
      fixture.componentRef.setInput('options', opts);
      fixture.detectChanges();

      expect(component.options()).toEqual(opts);
    });

    it('should pass cssClass via [class] alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should fall back to PageStandardComponent when variant is unknown', () => {
      fixture.componentRef.setInput('options', {
        title: 'fallback',
        variant: 'unknown-foo' as SmartPageVariant,
      });
      fixture.detectChanges();

      const standard = fixture.nativeElement.querySelector(
        'smart-page-standard',
      );
      expect(standard).toBeTruthy();
    });
  });

  describe('with PAGE_VARIANT_COMPONENTS_TOKEN', () => {
    let fixture: ComponentFixture<PageComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PageComponent, MockInjectedPageComponent],
        providers: [
          {
            provide: PAGE_VARIANT_COMPONENTS_TOKEN,
            useValue: { 'custom-a': MockInjectedPageComponent },
          },
          { provide: Location, useValue: { back: jest.fn() } },
          {
            provide: HardwareService,
            useValue: { isMobile: false, isMobileWeb: false },
          },
          { provide: AppService, useValue: {} },
        ],
      })
        .overrideComponent(PageStandardComponent, {
          remove: { imports: [TranslatePipe] },
          add: { imports: [MockTranslatePipe] },
        })
        .compileComponents();

      fixture = TestBed.createComponent(PageComponent);
    });

    it('should render the variant component when variant matches map key', () => {
      fixture.componentRef.setInput('options', {
        title: 'variant',
        variant: 'custom-a',
      });
      fixture.detectChanges();

      const injected = fixture.nativeElement.querySelector('section.injected');
      expect(injected).toBeTruthy();
    });

    it('should not render smart-page-standard when variant matches map key', () => {
      fixture.componentRef.setInput('options', {
        title: 'variant',
        variant: 'custom-a',
      });
      fixture.detectChanges();

      const standard = fixture.nativeElement.querySelector(
        'smart-page-standard',
      );
      expect(standard).toBeFalsy();
    });

    it('should fall back to PageStandardComponent when variant is not in map', () => {
      fixture.componentRef.setInput('options', {
        title: 'fallback',
        variant: 'missing-variant' as SmartPageVariant,
      });
      fixture.detectChanges();

      const standard = fixture.nativeElement.querySelector(
        'smart-page-standard',
      );
      expect(standard).toBeTruthy();
    });

    it('should render PageStandardComponent when variant is omitted', () => {
      fixture.componentRef.setInput('options', { title: 'no-variant' });
      fixture.detectChanges();

      const standard = fixture.nativeElement.querySelector(
        'smart-page-standard',
      );
      expect(standard).toBeTruthy();
    });
  });

  describe('ng-content fallback and bodyTpl precedence', () => {
    it('should project <ng-content> into the standard body via merged bodyTpl', async () => {
      await TestBed.configureTestingModule({
        imports: [HostComponent],
        providers: [
          { provide: Location, useValue: { back: jest.fn() } },
          {
            provide: HardwareService,
            useValue: { isMobile: false, isMobileWeb: false },
          },
          { provide: AppService, useValue: {} },
        ],
      })
        .overrideComponent(PageStandardComponent, {
          remove: { imports: [TranslatePipe] },
          add: { imports: [MockTranslatePipe] },
        })
        .compileComponents();

      const hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();
      hostFixture.detectChanges();

      const projected = hostFixture.nativeElement.querySelector('#projected');
      expect(projected).toBeTruthy();
      expect(projected.textContent.trim()).toBe('projected body');
    });

    it('should render options.bodyTpl instead of <ng-content> when both are provided', async () => {
      await TestBed.configureTestingModule({
        imports: [TplHostComponent],
        providers: [
          { provide: Location, useValue: { back: jest.fn() } },
          {
            provide: HardwareService,
            useValue: { isMobile: false, isMobileWeb: false },
          },
          { provide: AppService, useValue: {} },
        ],
      })
        .overrideComponent(PageStandardComponent, {
          remove: { imports: [TranslatePipe] },
          add: { imports: [MockTranslatePipe] },
        })
        .compileComponents();

      const hostFixture = TestBed.createComponent(TplHostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();
      hostFixture.detectChanges();

      const explicit = hostFixture.nativeElement.querySelector('#explicit');
      const projected = hostFixture.nativeElement.querySelector('#projected');

      expect(explicit).toBeTruthy();
      expect(projected).toBeFalsy();
    });
  });
});
