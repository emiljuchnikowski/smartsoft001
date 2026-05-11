import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerStandardComponent } from './standard.component';
import { IContainerOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `<smart-container-standard [options]="options" [class]="cssClass">
    <span class="projected">x</span>
  </smart-container-standard>`,
  imports: [ContainerStandardComponent],
})
class TestHostComponent {
  options: IContainerOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ContainerStandardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a wrapping <div> element', () => {
    const div = fixture.nativeElement.querySelector(
      'smart-container-standard > div',
    );

    expect(div).toBeTruthy();
  });

  it('should project ng-content children into the wrapping div', () => {
    const projected = fixture.nativeElement.querySelector(
      'smart-container-standard > div span.projected',
    );

    expect(projected).toBeTruthy();
    expect(projected.textContent).toBe('x');
  });

  it('should default data-mode and data-padding to absent when no options', () => {
    const div = fixture.nativeElement.querySelector(
      'smart-container-standard > div',
    );

    expect(div.getAttribute('data-mode')).toBeNull();
    expect(div.getAttribute('data-padding')).toBeNull();
  });

  it('should reflect options.mode in the data-mode attribute', async () => {
    host.options = { mode: 'constrained' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const div = fixture.nativeElement.querySelector(
      'smart-container-standard > div',
    );

    expect(div.getAttribute('data-mode')).toBe('constrained');
  });

  it('should reflect options.padding in the data-padding attribute', async () => {
    host.options = { padding: 'mobile' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const div = fixture.nativeElement.querySelector(
      'smart-container-standard > div',
    );

    expect(div.getAttribute('data-padding')).toBe('mobile');
  });

  it('should apply cssClass on the host div', async () => {
    host.cssClass = 'my-extra-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const div = fixture.nativeElement.querySelector(
      'smart-container-standard > div',
    );

    expect(div.className).toContain('my-extra-class');
  });
});
