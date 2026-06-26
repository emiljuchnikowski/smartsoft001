import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPresetComponent } from './preset.component';
import { ICardOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <ng-template #bodyTpl>Body content</ng-template>
    <ng-template #headerTpl>Header content</ng-template>
    <ng-template #footerTpl>Footer content</ng-template>
    <smart-card-preset
      [bodyTpl]="bodyTplRef"
      [headerTpl]="headerTplRef"
      [footerTpl]="footerTplRef"
      [options]="options"
      [hasHeader]="hasHeader"
      [hasFooter]="hasFooter"
      [cssClass]="cssClass"
    />
  `,
  imports: [CardPresetComponent],
})
class TestHostComponent {
  @ViewChild('bodyTpl', { static: true }) bodyTplRef!: TemplateRef<unknown>;
  @ViewChild('headerTpl', { static: true }) headerTplRef!: TemplateRef<unknown>;
  @ViewChild('footerTpl', { static: true }) footerTplRef!: TemplateRef<unknown>;

  options: ICardOptions | undefined = undefined;
  hasHeader = false;
  hasFooter = false;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: CardPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let card: CardPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    card = fixture.debugElement.children[0].componentInstance;
  });

  function root(): HTMLElement {
    return fixture.nativeElement.querySelector('smart-card-preset > div');
  }

  it('should create an instance', () => {
    expect(card).toBeInstanceOf(CardPresetComponent);
  });

  it('should render the Preline card container classes', () => {
    const cls = root().className;

    expect(cls).toContain('smart:rounded-xl');
    expect(cls).toContain('smart:shadow-2xs');
    expect(cls).toContain('smart:bg-white');
    expect(cls).toContain('smart:border');
  });

  it('should include dark mode classes on the container', () => {
    const cls = root().className;

    expect(cls).toContain('smart:dark:bg-gray-800');
    expect(cls).toContain('smart:dark:border-gray-700');
  });

  it('should render body via bodyTpl', () => {
    expect(root().textContent).toContain('Body content');
  });

  it('should not render header section when hasHeader is false', () => {
    expect(root().textContent).not.toContain('Header content');
  });

  it('should render header section when hasHeader is true', async () => {
    fixture.componentInstance.hasHeader = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(root().textContent).toContain('Header content');
  });

  it('should render h3 with title from options when hasHeader is true', async () => {
    fixture.componentInstance.hasHeader = true;
    fixture.componentInstance.options = { title: 'My Card Title' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const h3 = fixture.nativeElement.querySelector('h3');

    expect(h3).toBeTruthy();
    expect(h3.textContent.trim()).toBe('My Card Title');
    expect(h3.className).toContain('smart:font-semibold');
    expect(h3.className).toContain('smart:text-gray-900');
    expect(h3.className).toContain('smart:dark:text-white');
  });

  it('should apply the Preline header surface classes', async () => {
    fixture.componentInstance.hasHeader = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const header = root().querySelector('div');

    expect(header?.className).toContain('smart:bg-gray-50');
    expect(header?.className).toContain('smart:border-b');
  });

  it('should not render footer section when hasFooter is false', () => {
    expect(root().textContent).not.toContain('Footer content');
  });

  it('should render footer section when hasFooter is true', async () => {
    fixture.componentInstance.hasFooter = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(root().textContent).toContain('Footer content');
  });

  it('should apply gray body class when options.grayBody is true', async () => {
    fixture.componentInstance.options = { grayBody: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const bodyDiv = root().querySelector('div');

    expect(bodyDiv?.className).toContain('smart:bg-gray-50');
  });

  it('should apply gray footer class when options.grayFooter is true', async () => {
    fixture.componentInstance.hasFooter = true;
    fixture.componentInstance.options = { grayFooter: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const divs = root().querySelectorAll('div');
    const footerDiv = divs[divs.length - 1];

    expect(footerDiv.className).toContain('smart:bg-gray-50');
    expect(footerDiv.className).toContain('smart:border-t');
  });

  it('should apply cssClass on the container (canonical name for NgComponentOutlet)', async () => {
    fixture.componentInstance.cssClass = 'my-extra-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(root().className).toContain('my-extra-class');
  });
});
