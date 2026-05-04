import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarBaseComponent } from './base.component';
import { ISearchbarOptions } from '../../../models';

@Component({
  selector: 'smart-test-searchbar',
  template: '',
})
class TestSearchbarComponent extends SearchbarBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-searchbar
    [options]="options"
    [(text)]="text"
    [(show)]="show"
    [class]="cssClass"
  />`,
  imports: [TestSearchbarComponent],
})
class TestHostComponent {
  options: ISearchbarOptions | undefined = undefined;
  text = '';
  show = true;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: SearchbarBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestSearchbarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(directive).toBeInstanceOf(SearchbarBaseComponent);
  });

  it('should have smartType static equal to "searchbar"', () => {
    expect(SearchbarBaseComponent.smartType).toBe('searchbar');
  });

  it('should accept ISearchbarOptions via options input', async () => {
    host.options = { placeholder: 'search-placeholder' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({ placeholder: 'search-placeholder' });
  });

  it('should default show to true', () => {
    expect(directive.show()).toBe(true);
  });

  it('should default text to empty string when host binds ""', () => {
    expect(directive.text()).toBe('');
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-custom-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-custom-class');
  });

  it('should expose an UntypedFormControl via control signal', () => {
    expect(directive.control()).toBeDefined();
    expect(typeof directive.control().setValue).toBe('function');
  });

  it('should set show to true on setShow()', () => {
    directive.show.set(false);

    directive.setShow();

    expect(directive.show()).toBe(true);
  });

  it('should set show to false on tryHide() when control value is empty', () => {
    directive.control().setValue('');

    directive.tryHide();

    expect(directive.show()).toBe(false);
  });

  it('should keep show true on tryHide() when control value is non-empty', () => {
    directive.control().setValue('query');

    directive.tryHide();

    expect(directive.show()).toBe(true);
  });

  it('should sync control value when text input changes to non-empty value', async () => {
    host.text = 'hello';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.control().value).toBe('hello');
  });

  it('should update text model after debounce when control value changes', async () => {
    jest.useFakeTimers();
    try {
      directive.control().setValue('query');

      jest.advanceTimersByTime(1000);
      await Promise.resolve();

      expect(directive.text()).toBe('query');
    } finally {
      jest.useRealTimers();
    }
  });

  it('should not throw when destroyed (unsubscribes cleanly)', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});
