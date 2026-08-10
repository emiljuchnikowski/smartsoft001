import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { InfoPresetComponent } from './preset.component';
import { IInfoOptions } from '../../../models';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('@smartsoft001/shared-angular: InfoPresetComponent', () => {
  let fixture: ComponentFixture<InfoPresetComponent>;
  let component: InfoPresetComponent;
  let element: HTMLElement;

  const defaultOptions: IInfoOptions = { text: 'test info text' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPresetComponent],
    })
      .overrideComponent(InfoPresetComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(InfoPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', defaultOptions);
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  function button(): HTMLButtonElement {
    return element.querySelector('button') as HTMLButtonElement;
  }

  function tooltip(): HTMLElement | null {
    return element.querySelector('[role="tooltip"]');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(InfoPresetComponent);
  });

  it('should render the circular icon toggle button', () => {
    const cls = button().className;

    expect(button().querySelector('svg')).toBeTruthy();
    expect(cls).toContain('smart:rounded-full');
    expect(cls).toContain('smart:size-10');
  });

  it('should not show the tooltip by default', () => {
    expect(tooltip()).toBeNull();
  });

  it('should show the tooltip on mouseenter', () => {
    component.open();
    fixture.detectChanges();

    expect(tooltip()).toBeTruthy();
  });

  it('should render role="tooltip" with the text content', () => {
    component.open();
    fixture.detectChanges();

    expect(tooltip()?.getAttribute('role')).toBe('tooltip');
    expect(tooltip()?.textContent?.trim()).toBe('test info text');
  });

  it('should hide the tooltip on close', () => {
    component.open();
    fixture.detectChanges();
    component.close();
    fixture.detectChanges();

    expect(tooltip()).toBeNull();
  });

  it('should default to the top placement classes', () => {
    component.open();
    fixture.detectChanges();

    const cls = tooltip()?.className ?? '';

    expect(cls).toContain('smart:bottom-full');
    expect(cls).toContain('smart:bg-gray-900');
  });

  it('should apply bottom placement classes', () => {
    fixture.componentRef.setInput('placement', 'bottom');
    component.open();
    fixture.detectChanges();

    const cls = tooltip()?.className ?? '';

    expect(cls).toContain('smart:top-full');
    expect(cls).not.toContain('smart:bottom-full');
  });

  it('should apply left placement classes', () => {
    fixture.componentRef.setInput('placement', 'left');
    component.open();
    fixture.detectChanges();

    expect(tooltip()?.className).toContain('smart:right-full');
  });

  it('should apply right placement classes', () => {
    fixture.componentRef.setInput('placement', 'right');
    component.open();
    fixture.detectChanges();

    expect(tooltip()?.className).toContain('smart:left-full');
  });

  it('should set aria-describedby on the toggle while the tooltip is shown', () => {
    component.open();
    fixture.detectChanges();

    const describedBy = button().getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();
    expect(tooltip()?.getAttribute('id')).toBe(describedBy);
  });

  it('should not set aria-describedby while the tooltip is hidden', () => {
    expect(button().getAttribute('aria-describedby')).toBeNull();
  });

  it('should apply cssClass on the container (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    const container = element.querySelector('div') as HTMLElement;

    expect(container.className).toContain('my-extra-class');
  });
});
