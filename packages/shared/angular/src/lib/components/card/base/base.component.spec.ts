import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBaseComponent } from './base.component';

@Component({
  selector: 'smart-test-card',
  template: `<ng-template #bodyTpl>Body</ng-template>`,
})
class TestCardComponent extends CardBaseComponent {
  @ViewChild('bodyTpl', { static: true }) bodyTplRef!: TemplateRef<unknown>;
}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-card
    [bodyTpl]="card.bodyTplRef"
    [options]="options"
    [hasHeader]="hasHeader"
    [hasFooter]="hasFooter"
    #card
  />`,
  imports: [TestCardComponent],
})
class TestHostComponent {
  options: any = undefined;
  hasHeader = false;
  hasFooter = false;
}

describe('CardBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let card: TestCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    card = fixture.debugElement.children[0].componentInstance;
  });

  it('should default hasHeader to false', () => {
    expect(card.hasHeader()).toBe(false);
  });

  it('should default hasFooter to false', () => {
    expect(card.hasFooter()).toBe(false);
  });

  it('should default cssClass to empty string', () => {
    expect(card.cssClass()).toBe('');
  });

  it('should return overflow-hidden in shared container classes', () => {
    const classes = card.sharedContainerClasses();
    expect(classes).toContain('smart:overflow-hidden');
  });

  it('should not include divider classes without header or footer', () => {
    const classes = card.sharedContainerClasses();
    expect(classes).not.toContain('smart:divide-y');
  });

  it('should include divider classes when hasHeader is true', async () => {
    fixture.componentInstance.hasHeader = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    const classes = card.sharedContainerClasses();
    expect(classes).toContain('smart:divide-y');
    expect(classes).toContain('smart:divide-gray-200');
    expect(classes).toContain('smart:dark:divide-white/10');
  });

  it('should not include divider classes when grayFooter is set', async () => {
    fixture.componentInstance.hasFooter = true;
    fixture.componentInstance.options = { grayFooter: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    const classes = card.sharedContainerClasses();
    expect(classes).not.toContain('smart:divide-y');
  });

  it('should return header classes', () => {
    expect(card.headerClasses()).toBe('smart:px-4 smart:py-5 sm:smart:px-6');
  });

  it('should return body classes without gray', () => {
    expect(card.bodyClasses()).toContain('smart:px-4');
    expect(card.bodyClasses()).toContain('smart:py-5');
    expect(card.bodyClasses()).not.toContain('smart:bg-gray-50');
  });

  it('should include gray body classes when grayBody is set', async () => {
    fixture.componentInstance.options = { grayBody: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(card.bodyClasses()).toContain('smart:bg-gray-50');
  });

  it('should return footer classes without gray', () => {
    expect(card.footerClasses()).toContain('smart:px-4');
    expect(card.footerClasses()).toContain('smart:py-4');
    expect(card.footerClasses()).not.toContain('smart:bg-gray-50');
  });

  it('should include gray footer classes when grayFooter is set', async () => {
    fixture.componentInstance.options = { grayFooter: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(card.footerClasses()).toContain('smart:bg-gray-50');
  });
});
