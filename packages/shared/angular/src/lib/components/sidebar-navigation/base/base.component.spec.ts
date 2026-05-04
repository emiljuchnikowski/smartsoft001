import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavigationBaseComponent } from './base.component';
import { ISidebarNavOptions } from '../../../models';

@Component({
  selector: 'smart-test-sidebar-nav',
  template: '',
})
class TestSidebarNavComponent extends SidebarNavigationBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-sidebar-nav [options]="options" [class]="cssClass" />`,
  imports: [TestSidebarNavComponent],
})
class TestHostComponent {
  options: ISidebarNavOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: SidebarNavigationBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestSidebarNavComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create instance', () => {
    expect(directive).toBeInstanceOf(SidebarNavigationBaseComponent);
  });

  it('should have smartType = "sidebar-navigation"', () => {
    expect(SidebarNavigationBaseComponent.smartType).toBe('sidebar-navigation');
  });

  it('should default options/class', () => {
    expect(directive.options()).toBeUndefined();
    expect(directive.cssClass()).toBe('');
  });

  it('should accept options', async () => {
    host.options = { items: [{ id: 'a', label: 'A' }] };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()?.items?.length).toBe(1);
  });

  it('should expose itemClick output', () => {
    expect(directive.itemClick).toBeTruthy();
  });

  it('should expose itemToggle output', () => {
    expect(directive.itemToggle).toBeTruthy();
  });
});
