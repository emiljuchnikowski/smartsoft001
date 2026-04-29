import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBaseComponent } from './base.component';
import { ITableOptions } from '../../../models';

@Component({
  selector: 'smart-test-table',
  template: '',
})
class TestTableComponent extends TableBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-table [options]="options" [class]="cssClass" />`,
  imports: [TestTableComponent],
})
class TestHostComponent {
  options: ITableOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: TableBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestTableComponent;

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
    expect(directive).toBeInstanceOf(TableBaseComponent);
  });

  it('should have smartType static equal to "table"', () => {
    expect(TableBaseComponent.smartType).toBe('table');
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

  it('should accept ITableOptions via options input', async () => {
    host.options = {
      title: 'Users',
      columns: [{ key: 'name', label: 'Name' }],
      rows: [{ name: 'Lindsay Walton' }],
    };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      title: 'Users',
      columns: [{ key: 'name', label: 'Name' }],
      rows: [{ name: 'Lindsay Walton' }],
    });
  });
});
