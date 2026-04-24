import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { ButtonStandardComponent } from './standard.component';
import { IButtonOptions } from '../../../models';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('@smartsoft001/shared-angular: ButtonStandardComponent', () => {
  let fixture: ComponentFixture<ButtonStandardComponent>;
  let component: ButtonStandardComponent;

  const defaultOptions: IButtonOptions = { click: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonStandardComponent],
    })
      .overrideComponent(ButtonStandardComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ButtonStandardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', defaultOptions);
    fixture.detectChanges();
  });

  it('should render a button element', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button).toBeTruthy();
  });

  it('should apply inline-flex, items-center, justify-center classes', () => {
    const classes = component.buttonClasses();

    expect(classes).toContain('smart:inline-flex');
    expect(classes).toContain('smart:items-center');
    expect(classes).toContain('smart:justify-center');
  });

  it('should apply rounded-sm for xs size', () => {
    fixture.componentRef.setInput('options', { ...defaultOptions, size: 'xs' });
    fixture.detectChanges();

    const classes = component.buttonClasses();

    expect(classes).toContain('smart:rounded-sm');
  });

  it('should apply rounded-sm for sm size', () => {
    fixture.componentRef.setInput('options', { ...defaultOptions, size: 'sm' });
    fixture.detectChanges();

    const classes = component.buttonClasses();

    expect(classes).toContain('smart:rounded-sm');
  });

  it('should apply rounded-md for md size', () => {
    fixture.componentRef.setInput('options', { ...defaultOptions, size: 'md' });
    fixture.detectChanges();

    const classes = component.buttonClasses();

    expect(classes).toContain('smart:rounded-md');
  });

  it('should apply rounded-md for xl size', () => {
    fixture.componentRef.setInput('options', { ...defaultOptions, size: 'xl' });
    fixture.detectChanges();

    const classes = component.buttonClasses();

    expect(classes).toContain('smart:rounded-md');
  });

  it('should apply correct padding for xs size', () => {
    fixture.componentRef.setInput('options', { ...defaultOptions, size: 'xs' });
    fixture.detectChanges();

    const classes = component.buttonClasses();

    expect(classes).toContain('smart:px-2');
    expect(classes).toContain('smart:py-1');
    expect(classes).toContain('smart:text-xs');
  });

  it('should apply correct padding for sm size', () => {
    fixture.componentRef.setInput('options', { ...defaultOptions, size: 'sm' });
    fixture.detectChanges();

    const classes = component.buttonClasses();

    expect(classes).toContain('smart:px-2');
    expect(classes).toContain('smart:py-1');
    expect(classes).toContain('smart:text-sm');
  });

  it('should apply correct padding for md size', () => {
    fixture.componentRef.setInput('options', { ...defaultOptions, size: 'md' });
    fixture.detectChanges();

    const classes = component.buttonClasses();

    expect(classes).toContain('smart:px-2.5');
    expect(classes).toContain('smart:py-1.5');
    expect(classes).toContain('smart:text-sm');
  });

  it('should apply correct padding for lg size', () => {
    fixture.componentRef.setInput('options', { ...defaultOptions, size: 'lg' });
    fixture.detectChanges();

    const classes = component.buttonClasses();

    expect(classes).toContain('smart:px-3');
    expect(classes).toContain('smart:py-2');
    expect(classes).toContain('smart:text-sm');
  });

  it('should apply correct padding for xl size', () => {
    fixture.componentRef.setInput('options', { ...defaultOptions, size: 'xl' });
    fixture.detectChanges();

    const classes = component.buttonClasses();

    expect(classes).toContain('smart:px-3.5');
    expect(classes).toContain('smart:py-2.5');
    expect(classes).toContain('smart:text-sm');
  });

  it('should apply external cssClass', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const classes = component.buttonClasses();

    expect(classes).toContain('my-extra-class');
  });

  it('should show spinner icon when loading', () => {
    const loadingSignal = { value: true } as any;
    loadingSignal['()'] = undefined;
    fixture.componentRef.setInput('options', {
      ...defaultOptions,
      loading: () => true,
    });
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('smart-icon');

    expect(spinner).toBeTruthy();
  });

  it('should show confirm buttons when in confirm mode', () => {
    fixture.componentRef.setInput('options', {
      ...defaultOptions,
      confirm: true,
    });
    fixture.detectChanges();

    component.mode.set('confirm');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons.length).toBe(2);
  });

  it('should call click handler when button is clicked', () => {
    const clickFn = jest.fn();
    fixture.componentRef.setInput('options', { click: clickFn });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(clickFn).toHaveBeenCalledTimes(1);
  });
});
