import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarBaseComponent } from './base.component';
import { INavbarOptions } from '../../../models';

@Component({
  selector: 'smart-test-navbar',
  template: '',
})
class TestNavbarComponent extends NavbarBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-navbar
    [options]="options"
    [class]="cssClass"
    [(mobileMenuOpen)]="mobileMenuOpen"
  />`,
  imports: [TestNavbarComponent],
})
class TestHostComponent {
  options: INavbarOptions | undefined = undefined;
  cssClass = '';
  mobileMenuOpen = false;
}

describe('@smartsoft001/shared-angular: NavbarBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestNavbarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create instance', () => {
    expect(directive).toBeInstanceOf(NavbarBaseComponent);
  });

  it('should have smartType = "navbar"', () => {
    expect(NavbarBaseComponent.smartType).toBe('navbar');
  });

  it('should default options/class/mobileMenuOpen', () => {
    expect(directive.options()).toBeUndefined();
    expect(directive.cssClass()).toBe('');
    expect(directive.mobileMenuOpen()).toBe(false);
  });

  it('should accept options', async () => {
    host.options = { logoAlt: 'Acme' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({ logoAlt: 'Acme' });
  });

  it('should accept mobileMenuOpen via two-way model', async () => {
    host.mobileMenuOpen = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.mobileMenuOpen()).toBe(true);
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should expose itemClick output', () => {
    expect(directive.itemClick).toBeTruthy();
  });
});
