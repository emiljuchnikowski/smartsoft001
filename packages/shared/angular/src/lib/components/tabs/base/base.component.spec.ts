import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsBaseComponent } from './base.component';
import { ITabsOptions } from '../../../models';

@Component({
  selector: 'smart-test-tabs',
  template: '',
})
class TestTabsComponent extends TabsBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-tabs
    [options]="options"
    [class]="cssClass"
    [(selectedId)]="selectedId"
  />`,
  imports: [TestTabsComponent],
})
class TestHostComponent {
  options: ITabsOptions | undefined = undefined;
  cssClass = '';
  selectedId: string | null = null;
}

describe('@smartsoft001/shared-angular: TabsBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestTabsComponent;

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
    expect(directive).toBeInstanceOf(TabsBaseComponent);
  });

  it('should have smartType = "tabs"', () => {
    expect(TabsBaseComponent.smartType).toBe('tabs');
  });

  it('should default selectedId to null', () => {
    expect(directive.selectedId()).toBeNull();
  });

  it('should default options/class', () => {
    expect(directive.options()).toBeUndefined();
    expect(directive.cssClass()).toBe('');
  });

  it('should accept selectedId via two-way model', async () => {
    host.selectedId = 'team';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.selectedId()).toBe('team');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should expose tabChange output', () => {
    expect(directive.tabChange).toBeTruthy();
  });
});
