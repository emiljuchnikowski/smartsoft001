import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBaseComponent } from './base.component';
import { IPageOptions } from '../../../models';
import { AppService, HardwareService } from '../../../services';

@Component({
  selector: 'smart-test-page',
  template: '',
})
class TestPageComponent extends PageBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-page [options]="options" [class]="cssClass" />`,
  imports: [TestPageComponent],
})
class TestHostComponent {
  options: IPageOptions | null = { title: 'initial' };
  cssClass = '';
}

describe('@smartsoft001/shared-angular: PageBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let page: TestPageComponent;
  let locationMock: { back: jest.Mock };
  let hardwareMock: { isMobile: boolean; isMobileWeb: boolean };

  beforeEach(async () => {
    locationMock = { back: jest.fn() };
    hardwareMock = { isMobile: false, isMobileWeb: false };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: Location, useValue: locationMock },
        { provide: HardwareService, useValue: hardwareMock },
        { provide: AppService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    page = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(page).toBeInstanceOf(PageBaseComponent);
  });

  it('should have smartType static equal to "page"', () => {
    expect(PageBaseComponent.smartType).toBe('page');
  });

  it('should accept options input of IPageOptions', () => {
    expect(page.options()).toEqual({ title: 'initial' });
  });

  it('should update options when host updates', async () => {
    fixture.componentInstance.options = {
      title: 'updated',
      showBackButton: true,
    };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(page.options()).toEqual({
      title: 'updated',
      showBackButton: true,
    });
  });

  it('should default cssClass to empty string', () => {
    expect(page.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    fixture.componentInstance.cssClass = 'my-custom-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(page.cssClass()).toBe('my-custom-class');
  });

  it('should call Location.back() on back()', () => {
    page.back();

    expect(locationMock.back).toHaveBeenCalledTimes(1);
  });

  it('should return false from isMobile when both flags are false', () => {
    expect(page.isMobile).toBe(false);
  });

  it('should return true from isMobile when HardwareService.isMobile is true', () => {
    hardwareMock.isMobile = true;

    expect(page.isMobile).toBe(true);
  });

  it('should return true from isMobile when HardwareService.isMobileWeb is true', () => {
    hardwareMock.isMobileWeb = true;

    expect(page.isMobile).toBe(true);
  });
});
