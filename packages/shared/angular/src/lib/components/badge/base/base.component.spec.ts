import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeBaseComponent } from './base.component';
import { IBadgeOptions, SmartBadgeColor } from '../../../models';

@Component({
  selector: 'smart-test-badge',
  template: '',
})
class TestBadgeComponent extends BadgeBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-badge
    [text]="text"
    [color]="color"
    [size]="size"
    [options]="options"
    [class]="cssClass"
    (removed)="onRemoved()"
  />`,
  imports: [TestBadgeComponent],
})
class TestHostComponent {
  text = 'Badge';
  color: SmartBadgeColor = 'gray';
  size: 'sm' | 'md' = 'md';
  options: IBadgeOptions | undefined = undefined;
  cssClass = '';
  removedCount = 0;
  onRemoved(): void {
    this.removedCount++;
  }
}

describe('@smartsoft001/shared-angular: BadgeBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestBadgeComponent;

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
    expect(directive).toBeInstanceOf(BadgeBaseComponent);
  });

  it('should have smartType static equal to "badge"', () => {
    expect(BadgeBaseComponent.smartType).toBe('badge');
  });

  it('should expose required text input', () => {
    expect(directive.text()).toBe('Badge');
  });

  it('should default color to "gray"', () => {
    expect(directive.color()).toBe('gray');
  });

  it('should default size to "md"', () => {
    expect(directive.size()).toBe('md');
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

  it('should accept IBadgeOptions via options input', async () => {
    host.options = { withDot: true, withRemove: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({ withDot: true, withRemove: true });
  });

  it('should emit removed when remove() is called', () => {
    const spy = jest.fn();
    directive.removed.subscribe(spy);

    directive.remove();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
