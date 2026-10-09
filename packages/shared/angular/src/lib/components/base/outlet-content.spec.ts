import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EmbeddedViewRef,
  input,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { outletContent } from './outlet-content';

// Like the drawer and modal implementations, renders its slot only while open.
@Component({
  selector: 'smart-test-outlet-content-child',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (open()) {
      <section class="child"><ng-content /></section>
    }
  `,
})
class ChildComponent {
  open = input(true);
}

@Component({
  selector: 'smart-test-outlet-content-wrapper',
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ng-template #content><ng-content /></ng-template>
    <ng-container
      *ngComponentOutlet="
        child;
        inputs: { open: open() };
        content: projectedContent()
      "
    />
  `,
})
class WrapperComponent {
  readonly child = ChildComponent;
  open = input(true);

  private readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>('content');
  readonly projectedContent = outletContent(this.contentTemplate);
}

@Component({
  selector: 'smart-test-outlet-content-host',
  imports: [WrapperComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <smart-test-outlet-content-wrapper [open]="open()">
      <b class="projected">{{ text() }}</b>
      @if (extra()) {
        <i class="extra">Extra text</i>
      }
    </smart-test-outlet-content-wrapper>
  `,
})
class HostComponent {
  open = signal(true);
  text = signal('Projected text');
  extra = signal(false);
}

describe('@smartsoft001/shared-angular: outletContent', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('should render the projected content inside the component of the outlet', () => {
    const { element } = setup();

    const projected = element.querySelector('section.child b.projected');

    expect(projected?.textContent).toBe('Projected text');
  });

  it('should wrap the projected nodes in a display: contents span, valid in phrasing content like a button', () => {
    const { element } = setup();

    const slot = element.querySelector('b.projected')?.parentElement;

    expect(slot?.tagName).toBe('SPAN');
    expect(slot?.style.display).toBe('contents');
    expect(slot?.parentElement?.matches('section.child')).toBe(true);
  });

  it('should keep the bindings of the projected content up to date', () => {
    const { fixture, element } = setup();

    fixture.componentInstance.text.set('Updated text');
    fixture.detectChanges();

    const projected = element.querySelector('section.child b.projected');
    expect(projected?.textContent).toBe('Updated text');
  });

  it('should keep the component of the outlet across change detection', () => {
    const { fixture } = setup();
    const findChild = () =>
      fixture.debugElement.query(
        (el) => el.componentInstance instanceof ChildComponent,
      ).componentInstance;
    const before = findChild();

    fixture.componentInstance.text.set('Updated text');
    fixture.detectChanges();

    expect(findChild()).toBe(before);
  });

  it('should render content added at the root of the projected content while the slot was hidden', () => {
    const { fixture, element } = setup();
    const host = fixture.componentInstance;
    host.open.set(false);
    fixture.detectChanges();
    host.extra.set(true);
    fixture.detectChanges();

    host.open.set(true);
    fixture.detectChanges();

    const extra = element.querySelector('section.child i.extra');
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
      const { fixture } = setup();
      const views = createView.mock.results.map(
        (result) => result.value as EmbeddedViewRef<unknown>,
      );

      fixture.destroy();

      expect(views).toHaveLength(1);
      expect(views[0].destroyed).toBe(true);
    });
  });
});
