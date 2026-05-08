import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContainerStandardComponent } from './standard.component';
import { IListContainerOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `<smart-list-container-standard
    [options]="options"
    [class]="cssClass"
  >
    <div class="child-1">child 1</div>
    <div class="child-2">child 2</div>
  </smart-list-container-standard>`,
  imports: [ListContainerStandardComponent],
})
class TestHostComponent {
  options: IListContainerOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ListContainerStandardComponent', () => {
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

  it('should render a div element with role="list"', () => {
    const el = fixture.nativeElement.querySelector('div[role="list"]');

    expect(el).toBeTruthy();
  });

  it('should not set data-variant when options is not provided', () => {
    const el = fixture.nativeElement.querySelector('div[role="list"]');

    expect(el.getAttribute('data-variant')).toBeNull();
  });

  it('should set data-variant from options when provided', async () => {
    host.options = { variant: 'separate-cards' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement.querySelector('div[role="list"]');

    expect(el.getAttribute('data-variant')).toBe('separate-cards');
  });

  it('should project ng-content children inside the list container', () => {
    const el = fixture.nativeElement.querySelector('div[role="list"]');

    expect(el.querySelector('.child-1')).toBeTruthy();
    expect(el.querySelector('.child-2')).toBeTruthy();
  });

  it('should apply external cssClass on the host div when provided', async () => {
    host.cssClass = 'my-extra-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement.querySelector('div[role="list"]');

    expect(el.className).toContain('my-extra-class');
  });
});
