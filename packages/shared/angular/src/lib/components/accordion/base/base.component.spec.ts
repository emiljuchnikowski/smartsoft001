import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionBaseComponent } from './base.component';

@Component({
  selector: 'smart-test-accordion',
  template: `
    <ng-template #headerTpl>Header</ng-template>
    <ng-template #bodyTpl>Body</ng-template>
  `,
})
class TestAccordionComponent extends AccordionBaseComponent {
  @ViewChild('headerTpl', { static: true })
  headerTplRef!: TemplateRef<unknown>;
  @ViewChild('bodyTpl', { static: true }) bodyTplRef!: TemplateRef<unknown>;
}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-accordion
    [headerTpl]="accordion.headerTplRef"
    [bodyTpl]="accordion.bodyTplRef"
    [options]="options"
    #accordion
  />`,
  imports: [TestAccordionComponent],
})
class TestHostComponent {
  options: any = undefined;
}

describe('AccordionBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let accordion: TestAccordionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    accordion = fixture.debugElement.children[0].componentInstance;
  });

  it('should default show to false', () => {
    expect(accordion.show()).toBe(false);
  });

  it('should default cssClass to empty string', () => {
    expect(accordion.cssClass()).toBe('');
  });

  it('should toggle show from false to true', () => {
    accordion.toggle();
    expect(accordion.show()).toBe(true);
  });

  it('should toggle show from true to false', () => {
    accordion.show.set(true);
    accordion.toggle();
    expect(accordion.show()).toBe(false);
  });

  it('should not toggle when disabled', async () => {
    fixture.componentInstance.options = { disabled: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    accordion.toggle();
    expect(accordion.show()).toBe(false);
  });

  it('should return shared container classes', () => {
    const classes = accordion.sharedContainerClasses();
    expect(classes).toContain('smart:divide-y');
    expect(classes).toContain('smart:rounded-lg');
    expect(classes).toContain('smart:border');
    expect(classes).toContain('smart:border-gray-200');
    expect(classes).toContain('smart:dark:divide-white/10');
    expect(classes).toContain('smart:dark:border-white/10');
  });
});
