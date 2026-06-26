import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonPresetComponent } from './preset.component';
import { IButtonOptions } from '../../../models';

@Component({
  selector: 'smart-button-preset-host',
  imports: [ButtonPresetComponent],
  template: `
    <smart-button-preset [options]="options" [disabled]="disabled">
      {{ label }}
    </smart-button-preset>
  `,
})
class HostComponent {
  options: IButtonOptions = { click: () => undefined };
  disabled = false;
  label = 'Save';
}

describe('@smartsoft001/shared-angular: ButtonPresetComponent', () => {
  let fixture: ComponentFixture<ButtonPresetComponent>;
  let component: ButtonPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPresetComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', {
      click: () => undefined,
    } as IButtonOptions);
    fixture.detectChanges();
  });

  function button(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(ButtonPresetComponent);
  });

  it('should render a button element', () => {
    expect(button()).toBeTruthy();
  });

  it('should default to the solid (primary) variant with indigo color and md size', () => {
    const cls = button().className;

    expect(cls).toContain('smart:bg-indigo-600');
    expect(cls).toContain('smart:text-white');
    expect(cls).toContain('smart:rounded-lg');
    expect(cls).toContain('smart:px-4');
    expect(cls).toContain('smart:py-3');
  });

  it('should apply outline classes for the secondary variant', () => {
    fixture.componentRef.setInput('options', {
      click: () => undefined,
      variant: 'secondary',
      color: 'blue',
    } as IButtonOptions);
    fixture.detectChanges();

    const cls = button().className;

    expect(cls).toContain('smart:border-gray-200');
    expect(cls).toContain('smart:hover:text-blue-600');
    expect(cls).not.toContain('smart:bg-blue-600');
  });

  it('should apply soft classes for the soft variant', () => {
    fixture.componentRef.setInput('options', {
      click: () => undefined,
      variant: 'soft',
      color: 'green',
    } as IButtonOptions);
    fixture.detectChanges();

    const cls = button().className;

    expect(cls).toContain('smart:bg-green-100');
    expect(cls).toContain('smart:text-green-800');
  });

  it('should apply the sm size classes', () => {
    fixture.componentRef.setInput('options', {
      click: () => undefined,
      size: 'sm',
    } as IButtonOptions);
    fixture.detectChanges();

    const cls = button().className;

    expect(cls).toContain('smart:px-3');
    expect(cls).toContain('smart:py-2');
  });

  it('should render a pill shape when options.rounded is true', () => {
    fixture.componentRef.setInput('options', {
      click: () => undefined,
      rounded: true,
    } as IButtonOptions);
    fixture.detectChanges();

    const cls = button().className;

    expect(cls).toContain('smart:rounded-full');
    expect(cls).not.toContain('smart:rounded-lg');
  });

  it('should use square padding for circular buttons', () => {
    fixture.componentRef.setInput('options', {
      click: () => undefined,
      circular: true,
    } as IButtonOptions);
    fixture.detectChanges();

    const cls = button().className;

    expect(cls).toContain('smart:rounded-full');
    expect(cls).toContain('smart:p-3');
    expect(cls).not.toContain('smart:px-4');
  });

  it('should be disabled when the disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(button().disabled).toBe(true);
  });

  it('should invoke the click handler on click', () => {
    const click = jest.fn();
    fixture.componentRef.setInput('options', {
      click,
    } as IButtonOptions);
    fixture.detectChanges();

    button().click();

    expect(click).toHaveBeenCalledTimes(1);
  });

  it('should show the confirm prompt and only fire click after confirming', () => {
    const click = jest.fn();
    fixture.componentRef.setInput('options', {
      click,
      confirm: true,
    } as IButtonOptions);
    fixture.detectChanges();

    button().click();
    fixture.detectChanges();

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'button',
    );
    expect(buttons.length).toBe(2);
    expect(click).not.toHaveBeenCalled();

    (buttons[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(click).toHaveBeenCalledTimes(1);
  });

  it('should render a spinner instead of content while loading', () => {
    fixture.componentRef.setInput('options', {
      click: () => undefined,
      loading: signal(true),
    } as IButtonOptions);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('smart-icon')).toBeTruthy();
    expect(button().disabled).toBe(true);
  });

  it('should apply cssClass on the button (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(button().className).toContain('my-extra-class');
  });

  it('should project content as the button label', () => {
    const hostFixture = TestBed.createComponent(HostComponent);
    hostFixture.detectChanges();

    const hostButton = (hostFixture.nativeElement as HTMLElement).querySelector(
      'button',
    ) as HTMLButtonElement | null;

    expect(hostButton?.textContent?.trim()).toContain('Save');
  });
});
