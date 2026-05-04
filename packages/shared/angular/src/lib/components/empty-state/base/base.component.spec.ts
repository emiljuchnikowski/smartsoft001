import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateBaseComponent } from './base.component';
import { IEmptyStateOptions } from '../../../models';

@Component({
  selector: 'smart-test-empty-state',
  template: '',
})
class TestEmptyStateComponent extends EmptyStateBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-empty-state [options]="options" [class]="cssClass" />`,
  imports: [TestEmptyStateComponent],
})
class TestHostComponent {
  options: IEmptyStateOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: EmptyStateBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestEmptyStateComponent;

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
    expect(directive).toBeInstanceOf(EmptyStateBaseComponent);
  });

  it('should have smartType = "empty-state"', () => {
    expect(EmptyStateBaseComponent.smartType).toBe('empty-state');
  });

  it('should default options/class', () => {
    expect(directive.options()).toBeUndefined();
    expect(directive.cssClass()).toBe('');
  });

  it('should accept options', async () => {
    host.options = { title: 'No projects' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({ title: 'No projects' });
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should expose actionClick and itemClick outputs', () => {
    expect(directive.actionClick).toBeTruthy();
    expect(directive.itemClick).toBeTruthy();
  });
});
