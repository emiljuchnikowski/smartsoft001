import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridListBaseComponent } from './base.component';
import { IGridListOptions } from '../../../models';

@Component({
  selector: 'smart-test-grid-list',
  template: '',
})
class TestGridListComponent extends GridListBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-grid-list [options]="options" [class]="cssClass" />`,
  imports: [TestGridListComponent],
})
class TestHostComponent {
  options: IGridListOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: GridListBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestGridListComponent;

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
    expect(directive).toBeInstanceOf(GridListBaseComponent);
  });

  it('should have smartType static equal to "grid-list"', () => {
    expect(GridListBaseComponent.smartType).toBe('grid-list');
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

  it('should accept IGridListOptions via options input', async () => {
    host.options = {
      title: 'Team',
      items: [{ id: '1', title: 'Lindsay Walton' }],
      columns: 3,
      layout: 'cards',
    };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      title: 'Team',
      items: [{ id: '1', title: 'Lindsay Walton' }],
      columns: 3,
      layout: 'cards',
    });
  });
});
