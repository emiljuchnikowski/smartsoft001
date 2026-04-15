import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconBaseComponent, IconName } from './base.component';

@Component({
  selector: 'smart-test-icon',
  template: '',
})
class TestIconComponent extends IconBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-icon [name]="name" [class]="cssClass" />`,
  imports: [TestIconComponent],
})
class TestHostComponent {
  name: IconName = 'spinner';
  cssClass = '';
}

describe('IconBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let icon: TestIconComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    icon = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(icon).toBeInstanceOf(IconBaseComponent);
  });

  it('should have name input with required value', () => {
    expect(icon.name()).toBe('spinner');
  });

  it('should update name input when host changes value', async () => {
    fixture.componentInstance.name = 'chevron-down';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(icon.name()).toBe('chevron-down');
  });

  it('should default cssClass to empty string', () => {
    expect(icon.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    fixture.componentInstance.cssClass = 'custom-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(icon.cssClass()).toBe('custom-class');
  });
});
