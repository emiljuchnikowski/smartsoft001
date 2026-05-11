import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBaseComponent } from './base.component';
import { IContainerOptions } from '../../../models';

@Component({
  selector: 'smart-test-container',
  template: '',
})
class TestContainerComponent extends ContainerBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-container [options]="options" [class]="cssClass" />`,
  imports: [TestContainerComponent],
})
class TestHostComponent {
  options: IContainerOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ContainerBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestContainerComponent;

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
    expect(directive).toBeInstanceOf(ContainerBaseComponent);
  });

  it('should have smartType static equal to "container"', () => {
    expect(ContainerBaseComponent.smartType).toBe('container');
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should default options to undefined', () => {
    expect(directive.options()).toBeUndefined();
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should accept IContainerOptions via options input', async () => {
    host.options = {
      mode: 'constrained',
      padding: 'mobile',
      narrow: true,
    };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      mode: 'constrained',
      padding: 'mobile',
      narrow: true,
    });
  });
});
