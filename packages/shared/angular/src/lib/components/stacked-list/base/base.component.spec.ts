import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedListBaseComponent } from './base.component';
import { IStackedListOptions } from '../../../models';

@Component({
  selector: 'smart-test-stacked-list',
  template: '',
})
class TestStackedListComponent extends StackedListBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-stacked-list
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestStackedListComponent],
})
class TestHostComponent {
  options: IStackedListOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: StackedListBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestStackedListComponent;

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
    expect(directive).toBeInstanceOf(StackedListBaseComponent);
  });

  it('should have smartType static equal to "stacked-list"', () => {
    expect(StackedListBaseComponent.smartType).toBe('stacked-list');
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

  it('should accept IStackedListOptions via options input', async () => {
    host.options = {
      title: 'Team members',
      items: [{ id: '1', title: 'Lindsay Walton', description: 'Front-end' }],
    };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      title: 'Team members',
      items: [{ id: '1', title: 'Lindsay Walton', description: 'Front-end' }],
    });
  });
});
