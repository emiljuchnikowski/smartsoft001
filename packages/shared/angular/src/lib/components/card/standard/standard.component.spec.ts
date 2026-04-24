import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStandardComponent } from './standard.component';
import { ICardOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <ng-template #bodyTpl>Body content</ng-template>
    <ng-template #headerTpl>Header content</ng-template>
    <ng-template #footerTpl>Footer content</ng-template>
    <smart-card-standard
      [bodyTpl]="bodyTplRef"
      [headerTpl]="headerTplRef"
      [footerTpl]="footerTplRef"
      [options]="options"
      [hasHeader]="hasHeader"
      [hasFooter]="hasFooter"
      [cssClass]="cssClass"
    />
  `,
  imports: [CardStandardComponent],
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

describe('@smartsoft001/shared-angular: CardStandardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let card: CardStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    card = fixture.debugElement.children[0].componentInstance;
  });

  it('should render root div with rounded-lg, bg-white, shadow-sm and overflow-hidden classes', () => {
    const root = fixture.nativeElement.querySelector(
      'smart-card-standard > div',
    );

    expect(root).toBeTruthy();
    expect(root.className).toContain('smart:rounded-lg');
    expect(root.className).toContain('smart:bg-white');
    expect(root.className).toContain('smart:shadow-sm');
    expect(root.className).toContain('smart:overflow-hidden');
  });

  it('should include dark mode class on root container', () => {
    const root = fixture.nativeElement.querySelector(
      'smart-card-standard > div',
    );

    expect(root.className).toContain('smart:dark:bg-gray-800/50');
  });

  it('should append cssClass input to container classes', async () => {
    fixture.componentInstance.cssClass = 'my-extra-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement.querySelector(
      'smart-card-standard > div',
    );

    expect(root.className).toContain('my-extra-class');
  });

  it('should render body via bodyTpl', () => {
    const root = fixture.nativeElement.querySelector(
      'smart-card-standard > div',
    );

    expect(root.textContent).toContain('Body content');
  });

  it('should not render header section when hasHeader is false', () => {
    const root = fixture.nativeElement.querySelector(
      'smart-card-standard > div',
    );

    expect(root.textContent).not.toContain('Header content');
  });

  it('should render header section when hasHeader is true', async () => {
    fixture.componentInstance.hasHeader = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement.querySelector(
      'smart-card-standard > div',
    );

    expect(root.textContent).toContain('Header content');
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
    expect(h3.className).toContain('smart:text-base');
    expect(h3.className).toContain('smart:font-semibold');
    expect(h3.className).toContain('smart:text-gray-900');
    expect(h3.className).toContain('smart:dark:text-white');
  });

  it('should not render footer section when hasFooter is false', () => {
    const root = fixture.nativeElement.querySelector(
      'smart-card-standard > div',
    );

    expect(root.textContent).not.toContain('Footer content');
  });

  it('should render footer section when hasFooter is true', async () => {
    fixture.componentInstance.hasFooter = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement.querySelector(
      'smart-card-standard > div',
    );

    expect(root.textContent).toContain('Footer content');
  });

  it('should apply divide-y class when header is present', async () => {
    fixture.componentInstance.hasHeader = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement.querySelector(
      'smart-card-standard > div',
    );

    expect(root.className).toContain('smart:divide-y');
  });

  it('should apply divide-y class when footer is present', async () => {
    fixture.componentInstance.hasFooter = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement.querySelector(
      'smart-card-standard > div',
    );

    expect(root.className).toContain('smart:divide-y');
  });

  it('should apply gray body class when options.grayBody is true', async () => {
    fixture.componentInstance.options = { grayBody: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const bodyDiv = fixture.nativeElement.querySelector(
      'smart-card-standard > div > div',
    );

    expect(bodyDiv.className).toContain('smart:bg-gray-50');
  });

  it('should apply gray footer class when options.grayFooter is true', async () => {
    fixture.componentInstance.hasFooter = true;
    fixture.componentInstance.options = { grayFooter: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const divs = fixture.nativeElement.querySelectorAll(
      'smart-card-standard > div > div',
    );
    const footerDiv = divs[divs.length - 1];

    expect(footerDiv.className).toContain('smart:bg-gray-50');
  });
});
