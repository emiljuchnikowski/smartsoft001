import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconBaseComponent } from './base.component';

@Component({
  selector: 'smart-test-icon',
  template: '',
})
class TestIconComponent extends IconBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-icon [class]="cssClass" />`,
  imports: [TestIconComponent],
})
class TestHostComponent {
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
