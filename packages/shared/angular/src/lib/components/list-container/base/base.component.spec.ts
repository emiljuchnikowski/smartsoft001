import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContainerBaseComponent } from './base.component';
import { IListContainerOptions } from '../../../models';

@Component({
  selector: 'smart-test-list-container',
  template: '',
})
class TestListContainerComponent extends ListContainerBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-list-container
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestListContainerComponent],
})
class TestHostComponent {
  options: IListContainerOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ListContainerBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestListContainerComponent;

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
    expect(directive).toBeInstanceOf(ListContainerBaseComponent);
  });

  it('should have smartType static equal to "list-container"', () => {
    expect(ListContainerBaseComponent.smartType).toBe('list-container');
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

  it('should accept IListContainerOptions via options input', async () => {
    host.options = { variant: 'separate-cards', fullWidthOnMobile: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      variant: 'separate-cards',
      fullWidthOnMobile: true,
    });
  });
});
