import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderBaseComponent } from './base.component';
import { SmartColor, SmartSize } from '../../../models';

@Component({
  selector: 'smart-test-loader',
  template: '',
})
class TestLoaderComponent extends LoaderBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-loader
    [show]="show"
    [size]="size"
    [color]="color"
    [class]="cssClass"
  />`,
  imports: [TestLoaderComponent],
})
class TestHostComponent {
  show = false;
  size: SmartSize = 'md';
  color: SmartColor = 'indigo';
  cssClass = '';
}

describe('@smartsoft001/shared-angular: LoaderBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let loader: TestLoaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    loader = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(loader).toBeInstanceOf(LoaderBaseComponent);
  });

  it('should have smartType static equal to "loader"', () => {
    expect(LoaderBaseComponent.smartType).toBe('loader');
  });

  it('should default show to false', () => {
    expect(loader.show()).toBe(false);
  });

  it('should default size to "md"', () => {
    expect(loader.size()).toBe('md');
  });

  it('should default color to "indigo"', () => {
    expect(loader.color()).toBe('indigo');
  });

  it('should default cssClass to empty string', () => {
    expect(loader.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    fixture.componentInstance.cssClass = 'custom-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(loader.cssClass()).toBe('custom-class');
  });

  it('should include animate-spin, default md size and indigo color in spinnerClasses', () => {
    const classes = loader.spinnerClasses();

    expect(classes).toContain('smart:animate-spin');
    expect(classes).toContain('smart:size-6');
    expect(classes).toContain('smart:text-indigo-600');
  });

  it('should map size "xs" to smart:size-4', async () => {
    fixture.componentInstance.size = 'xs';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(loader.spinnerClasses()).toContain('smart:size-4');
  });

  it('should map size "sm" to smart:size-5', async () => {
    fixture.componentInstance.size = 'sm';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(loader.spinnerClasses()).toContain('smart:size-5');
  });

  it('should map size "md" to smart:size-6', async () => {
    fixture.componentInstance.size = 'md';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(loader.spinnerClasses()).toContain('smart:size-6');
  });

  it('should map size "lg" to smart:size-8', async () => {
    fixture.componentInstance.size = 'lg';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(loader.spinnerClasses()).toContain('smart:size-8');
  });

  it('should map size "xl" to smart:size-10', async () => {
    fixture.componentInstance.size = 'xl';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(loader.spinnerClasses()).toContain('smart:size-10');
  });

  it('should map color "red" to smart:text-red-600', async () => {
    fixture.componentInstance.color = 'red';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(loader.spinnerClasses()).toContain('smart:text-red-600');
  });

  it('should map color "emerald" to smart:text-emerald-600', async () => {
    fixture.componentInstance.color = 'emerald';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(loader.spinnerClasses()).toContain('smart:text-emerald-600');
  });

  it('should include cssClass value in spinnerClasses when non-empty', async () => {
    fixture.componentInstance.cssClass = 'extra-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(loader.spinnerClasses()).toContain('extra-class');
  });

  it('should not include empty cssClass in spinnerClasses by default', () => {
    expect(loader.spinnerClasses()).not.toContain('');
  });
});
