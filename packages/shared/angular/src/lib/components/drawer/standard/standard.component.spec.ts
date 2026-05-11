import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerStandardComponent } from './standard.component';

@Component({
  selector: 'smart-test-host',
  template: `<smart-drawer-standard [open]="true">
    <span class="projected">x</span>
  </smart-drawer-standard>`,
  imports: [DrawerStandardComponent],
})
class TestHostComponent {}

describe('@smartsoft001/shared-angular: DrawerStandardComponent', () => {
  let fixture: ComponentFixture<DrawerStandardComponent>;
  let component: DrawerStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not render aside when open is false', () => {
    const aside = fixture.nativeElement.querySelector('aside');

    expect(aside).toBeNull();
  });

  it('should render aside[role="dialog"][aria-modal="true"] when open is true', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('aside');

    expect(aside).toBeTruthy();
    expect(aside.getAttribute('role')).toBe('dialog');
    expect(aside.getAttribute('aria-modal')).toBe('true');
  });

  it('should not render overlay by default', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.drawer-overlay');

    expect(overlay).toBeNull();
  });

  it('should render overlay when options.withOverlay is true', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('options', { withOverlay: true });
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.drawer-overlay');

    expect(overlay).toBeTruthy();
  });

  it('should default data-position to "right" when no options.position provided', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('aside');

    expect(aside.getAttribute('data-position')).toBe('right');
  });

  it('should reflect options.position in data-position attribute', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('options', { position: 'left' });
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('aside');

    expect(aside.getAttribute('data-position')).toBe('left');
  });

  it('should apply external cssClass on the aside element', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('aside');

    expect(aside.className).toContain('my-extra-class');
  });

  it('should not render header when no title is provided', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('header');

    expect(header).toBeNull();
  });

  it('should render header with title and close button when title is provided', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('title', 'My Drawer');
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('header');
    const heading = header?.querySelector('h2');
    const closeBtn = header?.querySelector('button[aria-label="Close"]');
    const aside = fixture.nativeElement.querySelector('aside');

    expect(header).toBeTruthy();
    expect(heading?.textContent?.trim()).toBe('My Drawer');
    expect(heading?.getAttribute('id')).toBe('smart-drawer-title');
    expect(closeBtn).toBeTruthy();
    expect(aside.getAttribute('aria-labelledby')).toBe('smart-drawer-title');
  });

  it('should set open to false and emit closed when close button is clicked', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('title', 'My Drawer');
    fixture.detectChanges();

    let emitted = 0;
    component.closed.subscribe(() => emitted++);

    const closeBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Close"]',
    );
    closeBtn.click();
    fixture.detectChanges();

    expect(component.open()).toBe(false);
    expect(emitted).toBe(1);
  });

  it('should close on overlay click', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('options', { withOverlay: true });
    fixture.detectChanges();

    let emitted = 0;
    component.closed.subscribe(() => emitted++);

    const overlay: HTMLElement =
      fixture.nativeElement.querySelector('.drawer-overlay');
    overlay.click();
    fixture.detectChanges();

    expect(component.open()).toBe(false);
    expect(emitted).toBe(1);
  });

  it('should project ng-content into the aside when open', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const projected =
      hostFixture.nativeElement.querySelector('aside .projected');

    expect(projected).toBeTruthy();
    expect(projected.textContent).toBe('x');
  });
});
