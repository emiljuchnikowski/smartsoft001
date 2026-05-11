import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarBaseComponent } from './base.component';
import {
  IAvatarItem,
  IAvatarOptions,
  SmartAvatarShape,
  SmartAvatarSize,
} from '../../../models';

@Component({
  selector: 'smart-test-avatar',
  template: '',
})
class TestAvatarComponent extends AvatarBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-avatar
    [imageUrl]="imageUrl"
    [initials]="initials"
    [size]="size"
    [shape]="shape"
    [notificationPosition]="notificationPosition"
    [group]="group"
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestAvatarComponent],
})
class TestHostComponent {
  imageUrl: string | undefined = undefined;
  initials: string | undefined = undefined;
  size: SmartAvatarSize = 'md';
  shape: SmartAvatarShape = 'circle';
  notificationPosition: 'top' | 'bottom' | undefined = undefined;
  group: IAvatarItem[] | undefined = undefined;
  options: IAvatarOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: AvatarBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestAvatarComponent;

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
    expect(directive).toBeInstanceOf(AvatarBaseComponent);
  });

  it('should have smartType static equal to "avatar"', () => {
    expect(AvatarBaseComponent.smartType).toBe('avatar');
  });

  it('should default size to "md"', () => {
    expect(directive.size()).toBe('md');
  });

  it('should default shape to "circle"', () => {
    expect(directive.shape()).toBe('circle');
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

  it('should accept IAvatarOptions via options input', async () => {
    host.options = { placeholderType: 'initials' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({ placeholderType: 'initials' });
  });

  it('should compute isGroup() as true when group has items', async () => {
    host.group = [{ id: '1', initials: 'AB' }];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.isGroup()).toBe(true);
  });

  it('should compute isGroup() as false when group is undefined', () => {
    expect(directive.isGroup()).toBe(false);
  });

  it('should compute isGroup() as false when group is empty array', async () => {
    host.group = [];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.isGroup()).toBe(false);
  });
});
