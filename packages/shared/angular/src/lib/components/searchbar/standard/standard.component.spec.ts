import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { SearchbarStandardComponent } from './standard.component';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('@smartsoft001/shared-angular: SearchbarStandardComponent', () => {
  let fixture: ComponentFixture<SearchbarStandardComponent>;
  let component: SearchbarStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbarStandardComponent],
    })
      .overrideComponent(SearchbarStandardComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SearchbarStandardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', '');
    fixture.detectChanges();
  });

  it('should render an <input type="search"> element when show() is true', () => {
    const input = fixture.nativeElement.querySelector('input[type="search"]');

    expect(input).toBeTruthy();
  });

  it('should NOT render the input when show() is false and showToggleButton is undefined', () => {
    component.show.set(false);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="search"]');

    expect(input).toBeNull();
  });

  it('should NOT render the input when show() is false and showToggleButton is false', () => {
    fixture.componentRef.setInput('options', { showToggleButton: false });
    component.show.set(false);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="search"]');

    expect(input).toBeNull();
  });

  it('should render a toggle button with a magnifier SVG when show() is false and showToggleButton is true', () => {
    fixture.componentRef.setInput('options', { showToggleButton: true });
    component.show.set(false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    const svg = button?.querySelector('svg');

    expect(button).toBeTruthy();
    expect(svg).toBeTruthy();
  });

  it('should call setShow() and render input when toggle button is clicked', () => {
    fixture.componentRef.setInput('options', { showToggleButton: true });
    component.show.set(false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(component.show()).toBe(true);
    const input = fixture.nativeElement.querySelector('input[type="search"]');
    expect(input).toBeTruthy();
  });

  it('should call tryHide() when input blur event fires', () => {
    const spy = jest.spyOn(component, 'tryHide');

    const input = fixture.nativeElement.querySelector('input[type="search"]');
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('should include Tailwind placeholder classes in inputClasses()', () => {
    const classes = component.inputClasses();

    expect(classes).toContain('smart:block');
    expect(classes).toContain('smart:w-full');
    expect(classes).toContain('smart:rounded-md');
    expect(classes).toContain('smart:bg-white');
    expect(classes).toContain('smart:py-1.5');
    expect(classes).toContain('smart:pr-10');
    expect(classes).toContain('smart:pl-3');
    expect(classes).toContain('smart:outline-1');
  });

  it('should include dark variants in inputClasses()', () => {
    const classes = component.inputClasses();

    expect(classes).toContain('dark:smart:bg-white/5');
    expect(classes).toContain('dark:smart:text-white');
    expect(classes).toContain('dark:smart:outline-white/10');
  });

  it('should include external cssClass in inputClasses() when provided', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const classes = component.inputClasses();

    expect(classes).toContain('my-extra-class');
  });

  it('should return outer container classes via containerClasses()', () => {
    const classes = component.containerClasses();

    expect(classes).toContain('smart:relative');
  });

  it('should use placeholder from options()', () => {
    fixture.componentRef.setInput('options', { placeholder: 'my-placeholder' });
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="search"]');

    expect(input.getAttribute('placeholder')).toBe('my-placeholder');
  });

  it('should fallback to "search" translation key when placeholder is not provided', () => {
    const input = fixture.nativeElement.querySelector('input[type="search"]');

    expect(input.getAttribute('placeholder')).toBe('search');
  });

  it('should bind formControl to control() from the base component', () => {
    const input = fixture.nativeElement.querySelector('input[type="search"]');

    component.control().setValue('typed-value');
    fixture.detectChanges();

    expect(input.value).toBe('typed-value');
  });
});
