import { signal, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonCircularComponent } from './circular/circular.component';
import { ButtonRoundedComponent } from './rounded/rounded.component';
import { ButtonStandardComponent } from './standard/standard.component';
import { IButtonOptions } from '../../models';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

const createOptions = (
  overrides: Partial<IButtonOptions> = {},
): IButtonOptions => ({
  click: jest.fn(),
  ...overrides,
});

describe('ButtonStandardComponent', () => {
  let fixture: ComponentFixture<ButtonStandardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonStandardComponent],
    })
      .overrideComponent(ButtonStandardComponent, {
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(ButtonStandardComponent);
  });

  it('should render a button', () => {
    fixture.componentRef.setInput('options', createOptions());
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });

  it('should apply primary variant by default', () => {
    fixture.componentRef.setInput('options', createOptions());
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:bg-indigo-600')).toBe(true);
    expect(btn.classList.contains('smart:text-white')).toBe(true);
  });

  it('should apply red color for primary variant', () => {
    fixture.componentRef.setInput('options', createOptions({ color: 'red' }));
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:bg-red-600')).toBe(true);
    expect(btn.classList.contains('smart:text-white')).toBe(true);
    expect(btn.classList.contains('smart:bg-indigo-600')).toBe(false);
  });

  it('should apply blue color for soft variant', () => {
    fixture.componentRef.setInput(
      'options',
      createOptions({ variant: 'soft', color: 'blue' }),
    );
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:bg-blue-50')).toBe(true);
    expect(btn.classList.contains('smart:text-blue-600')).toBe(true);
  });

  it('should default to indigo when no color specified', () => {
    fixture.componentRef.setInput('options', createOptions());
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:bg-indigo-600')).toBe(true);
  });

  it('should apply secondary variant', () => {
    fixture.componentRef.setInput(
      'options',
      createOptions({ variant: 'secondary' }),
    );
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:bg-white')).toBe(true);
    expect(btn.classList.contains('smart:text-gray-900')).toBe(true);
  });

  it('should apply soft variant', () => {
    fixture.componentRef.setInput(
      'options',
      createOptions({ variant: 'soft' }),
    );
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:bg-indigo-50')).toBe(true);
    expect(btn.classList.contains('smart:text-indigo-600')).toBe(true);
  });

  it('should apply xs size', () => {
    fixture.componentRef.setInput('options', createOptions({ size: 'xs' }));
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:rounded-sm')).toBe(true);
    expect(btn.classList.contains('smart:px-2')).toBe(true);
    expect(btn.classList.contains('smart:text-xs')).toBe(true);
  });

  it('should apply xl size', () => {
    fixture.componentRef.setInput('options', createOptions({ size: 'xl' }));
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:rounded-md')).toBe(true);
    expect(btn.classList.contains('smart:px-3.5')).toBe(true);
  });

  it('should apply disabled classes', () => {
    fixture.componentRef.setInput('options', createOptions());
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:opacity-50')).toBe(true);
  });

  it('should call click handler', () => {
    const clickFn = jest.fn();
    fixture.componentRef.setInput('options', createOptions({ click: clickFn }));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    expect(clickFn).toHaveBeenCalled();
  });

  it('should show confirm mode', () => {
    fixture.componentRef.setInput('options', createOptions({ confirm: true }));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('should append external class to button element', () => {
    fixture.componentRef.setInput('options', createOptions());
    fixture.componentRef.setInput('cssClass', 'smart:mt-4 custom-class');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:mt-4')).toBe(true);
    expect(btn.classList.contains('custom-class')).toBe(true);
  });

  it('should show icon spinner when loading', () => {
    const loadingSig = signal(true);
    fixture.componentRef.setInput(
      'options',
      createOptions({ loading: loadingSig }),
    );
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('smart-icon')).toBeTruthy();
  });
});

describe('ButtonRoundedComponent', () => {
  let fixture: ComponentFixture<ButtonRoundedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonRoundedComponent],
    })
      .overrideComponent(ButtonRoundedComponent, {
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(ButtonRoundedComponent);
  });

  it('should have rounded-full', () => {
    fixture.componentRef.setInput('options', createOptions());
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:rounded-full')).toBe(true);
  });

  it('should apply primary variant by default', () => {
    fixture.componentRef.setInput('options', createOptions());
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:bg-indigo-600')).toBe(true);
  });

  it('should apply secondary variant', () => {
    fixture.componentRef.setInput(
      'options',
      createOptions({ variant: 'secondary' }),
    );
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:bg-white')).toBe(true);
  });

  it('should apply xl rounded size', () => {
    fixture.componentRef.setInput('options', createOptions({ size: 'xl' }));
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:px-4')).toBe(true);
    expect(btn.classList.contains('smart:py-2.5')).toBe(true);
  });
});

describe('ButtonCircularComponent', () => {
  let fixture: ComponentFixture<ButtonCircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonCircularComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ButtonCircularComponent);
  });

  it('should have rounded-full', () => {
    fixture.componentRef.setInput('options', createOptions());
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:rounded-full')).toBe(true);
  });

  it('should apply p-1.5 for md', () => {
    fixture.componentRef.setInput('options', createOptions({ size: 'md' }));
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:p-1.5')).toBe(true);
  });

  it('should apply primary variant by default', () => {
    fixture.componentRef.setInput('options', createOptions());
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('smart:bg-indigo-600')).toBe(true);
  });

  it('should call click handler', () => {
    const clickFn = jest.fn();
    fixture.componentRef.setInput('options', createOptions({ click: clickFn }));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    expect(clickFn).toHaveBeenCalled();
  });
});
