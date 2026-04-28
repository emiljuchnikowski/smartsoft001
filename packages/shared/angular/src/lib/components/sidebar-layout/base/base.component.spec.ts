import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLayoutBaseComponent } from './base.component';
import { ISidebarLayoutOptions } from '../../../models';

@Component({
  selector: 'smart-test-sidebar-layout',
  template: '',
})
class TestSidebarLayoutComponent extends SidebarLayoutBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-sidebar-layout
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestSidebarLayoutComponent],
})
class TestHostComponent {
  options: ISidebarLayoutOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: SidebarLayoutBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestSidebarLayoutComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(directive).toBeInstanceOf(SidebarLayoutBaseComponent);
  });

  it('should have smartType static equal to "sidebar-layout"', () => {
    expect(SidebarLayoutBaseComponent.smartType).toBe('sidebar-layout');
  });

  it('should default options to undefined', () => {
    expect(directive.options()).toBeUndefined();
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should accept ISidebarLayoutOptions via options input', async () => {
    host.options = { title: 'Dashboard', sidebarPosition: 'right' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      title: 'Dashboard',
      sidebarPosition: 'right',
    });
  });
});
