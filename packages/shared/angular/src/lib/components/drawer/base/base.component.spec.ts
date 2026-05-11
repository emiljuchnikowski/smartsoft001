import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerBaseComponent } from './base.component';
import { IDrawerOptions } from '../../../models';

@Component({
  selector: 'smart-test-drawer',
  template: '',
})
class TestDrawerComponent extends DrawerBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-drawer
    [(open)]="open"
    [title]="title"
    [options]="options"
    [class]="cssClass"
    (closed)="onClosed()"
  />`,
  imports: [TestDrawerComponent],
})
class TestHostComponent {
  open = false;
  title: string | undefined = undefined;
  options: IDrawerOptions | undefined = undefined;
  cssClass = '';
  closedCount = 0;
  onClosed(): void {
    this.closedCount++;
  }
}

describe('@smartsoft001/shared-angular: DrawerBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestDrawerComponent;

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
    expect(directive).toBeInstanceOf(DrawerBaseComponent);
  });

  it('should have smartType static equal to "drawer"', () => {
    expect(DrawerBaseComponent.smartType).toBe('drawer');
  });

  it('should default open to false', () => {
    expect(directive.open()).toBe(false);
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

  it('should accept IDrawerOptions via options input', async () => {
    host.options = { position: 'left', withOverlay: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      position: 'left',
      withOverlay: true,
    });
  });

  it('should set open to false and emit closed on close()', async () => {
    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    directive.close();

    expect(directive.open()).toBe(false);
    expect(host.closedCount).toBe(1);
  });
});
