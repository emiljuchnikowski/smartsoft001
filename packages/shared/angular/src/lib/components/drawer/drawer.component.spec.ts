import {
  Component,
  EmbeddedViewRef,
  input,
  ChangeDetectionStrategy,
  signal,
  TemplateRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerBaseComponent } from './base/base.component';
import { DrawerComponent } from './drawer.component';
import { DRAWER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-drawer-injected',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div class="injected-drawer">injected</div>',
})
class MockInjectedComponent extends DrawerBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

// Like the standard and preset drawers, renders its slot only while open.
@Component({
  selector: 'smart-test-drawer-with-slot',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (open()) {
      <div class="custom-drawer"><ng-content /></div>
    }
  `,
})
class MockSlotComponent extends DrawerBaseComponent {
  override cssClass = input<string>('');
}

const HOST_TEMPLATE = `
  <smart-drawer [open]="open()">
    <p class="projected">{{ text() }}</p>
    @if (extra()) {
      <p class="extra">Extra text</p>
    }
  </smart-drawer>
`;

@Component({
  selector: 'smart-test-drawer-standard-host',
  imports: [DrawerComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: HOST_TEMPLATE,
})
class StandardHostComponent {
  open = signal(true);
  text = signal('Projected text');
  extra = signal(false);
}

@Component({
  selector: 'smart-test-drawer-host',
  imports: [DrawerComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: DRAWER_STANDARD_COMPONENT_TOKEN, useValue: MockSlotComponent },
  ],
  template: HOST_TEMPLATE,
})
class InjectedHostComponent extends StandardHostComponent {}

/** Closes the drawer, renders the host's root-level `@if`, then reopens. */
function addRootContentWhileClosed(
  fixture: ComponentFixture<StandardHostComponent>,
): void {
  const host = fixture.componentInstance;
  host.open.set(false);
  fixture.detectChanges();
  host.extra.set(true);
  fixture.detectChanges();
  host.open.set(true);
  fixture.detectChanges();
}

describe('@smartsoft001/shared-angular: DrawerComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<DrawerComponent>;
    let component: DrawerComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DrawerComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(DrawerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-drawer-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-drawer-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate open input to standard component', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      expect(component.open()).toBe(true);
    });

    it('should propagate title input to standard component', () => {
      fixture.componentRef.setInput('title', 'Drawer Title');
      fixture.detectChanges();

      expect(component.title()).toBe('Drawer Title');
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', {
        position: 'left',
        withOverlay: true,
      });
      fixture.detectChanges();

      expect(component.options()).toEqual({
        position: 'left',
        withOverlay: true,
      });
    });
  });

  describe('with DRAWER_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<DrawerComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DrawerComponent, MockInjectedComponent],
        providers: [
          {
            provide: DRAWER_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DrawerComponent);
      fixture.detectChanges();
    });

    it('should render injected component when DRAWER_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-drawer',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-drawer-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-drawer-standard',
      );

      expect(standard).toBeNull();
    });

    describe('outputs of the injected component', () => {
      let injected: MockInjectedComponent;

      beforeEach(async () => {
        await fixture.whenStable();
        injected = fixture.debugElement.query(
          (el) => el.componentInstance instanceof MockInjectedComponent,
        ).componentInstance;
      });

      it('should write open back to the wrapper model', () => {
        injected.open.set(true);

        expect(fixture.componentInstance.open()).toEqual(true);
      });

      it('should re-emit closed through the wrapper', () => {
        const spy = jest.fn();
        fixture.componentInstance.closed.subscribe(spy);

        injected.closed.emit();

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('projected content without token', () => {
    let fixture: ComponentFixture<StandardHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StandardHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(StandardHostComponent);
      fixture.detectChanges();
    });

    it('should render the projected content inside smart-drawer-standard', () => {
      const projected = fixture.nativeElement.querySelector(
        'smart-drawer-standard aside p.projected',
      );

      expect(projected?.textContent).toBe('Projected text');
    });

    it('should render content added at the root of the projected content while closed once reopened', () => {
      addRootContentWhileClosed(fixture);

      const extra = fixture.nativeElement.querySelector(
        'smart-drawer-standard aside p.extra',
      );
      expect(extra?.textContent).toBe('Extra text');
    });
  });

  describe('projected content with DRAWER_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<InjectedHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [InjectedHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(InjectedHostComponent);
      fixture.detectChanges();
    });

    it('should render the projected content inside the injected component', () => {
      const projected = fixture.nativeElement.querySelector(
        '.custom-drawer p.projected',
      );

      expect(projected?.textContent).toBe('Projected text');
    });

    it('should keep the bindings of the projected content up to date', () => {
      fixture.componentInstance.text.set('Updated text');
      fixture.detectChanges();

      const projected = fixture.nativeElement.querySelector(
        '.custom-drawer p.projected',
      );
      expect(projected?.textContent).toBe('Updated text');
    });

    it('should render content added at the root of the projected content while closed once reopened', () => {
      addRootContentWhileClosed(fixture);

      const extra = fixture.nativeElement.querySelector(
        '.custom-drawer p.extra',
      );
      expect(extra?.textContent).toBe('Extra text');
    });

    describe('on destroy', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should destroy the detached view that holds the projected content', () => {
        const createView = jest.spyOn(
          TemplateRef.prototype,
          'createEmbeddedView',
        );
        const hostFixture = TestBed.createComponent(InjectedHostComponent);
        hostFixture.detectChanges();
        const views = createView.mock.results.map(
          (result) => result.value as EmbeddedViewRef<unknown>,
        );

        hostFixture.destroy();

        expect(views).toHaveLength(1);
        expect(views[0].destroyed).toBe(true);
      });
    });
  });
});
