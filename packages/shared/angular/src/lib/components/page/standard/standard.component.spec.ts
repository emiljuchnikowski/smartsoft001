import { Location } from '@angular/common';
import {
  Component,
  Pipe,
  PipeTransform,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { PageStandardComponent } from './standard.component';
import { IPageOptions } from '../../../models';
import { AppService, HardwareService } from '../../../services';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Component({
  selector: 'smart-standard-tpl-host',
  template: `
    <smart-page-standard [options]="opts()"></smart-page-standard>
    <ng-template #bodyTpl>
      <p id="body">body-content</p>
    </ng-template>
  `,
  imports: [PageStandardComponent],
})
class BodyTplHostComponent {
  bodyTpl = viewChild<TemplateRef<unknown>>('bodyTpl');

  opts(): IPageOptions {
    return { title: 'host', bodyTpl: this.bodyTpl() };
  }
}

describe('@smartsoft001/shared-angular: PageStandardComponent', () => {
  let fixture: ComponentFixture<PageStandardComponent>;
  let component: PageStandardComponent;
  let locationMock: { back: jest.Mock };
  let hardwareMock: { isMobile: boolean; isMobileWeb: boolean };

  beforeEach(async () => {
    locationMock = { back: jest.fn() };
    hardwareMock = { isMobile: false, isMobileWeb: false };

    await TestBed.configureTestingModule({
      imports: [PageStandardComponent],
      providers: [
        { provide: Location, useValue: locationMock },
        { provide: HardwareService, useValue: hardwareMock },
        { provide: AppService, useValue: {} },
      ],
    })
      .overrideComponent(PageStandardComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PageStandardComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render a header heading with translated title', () => {
    fixture.componentRef.setInput('options', { title: 'my-title' });
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h1, h2');

    expect(heading).toBeTruthy();
    expect(heading.textContent.trim()).toBe('my-title');
  });

  it('should not render header when hideHeader is true', () => {
    fixture.componentRef.setInput('options', {
      title: 'hidden',
      hideHeader: true,
    });
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h1, h2');

    expect(heading).toBeFalsy();
  });

  it('should render back button when showBackButton is true', () => {
    fixture.componentRef.setInput('options', {
      title: 'with-back',
      showBackButton: true,
    });
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('should call back() when back button is clicked', () => {
    fixture.componentRef.setInput('options', {
      title: 'with-back',
      showBackButton: true,
    });
    fixture.detectChanges();
    const backSpy = jest.spyOn(component, 'back');

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  it('should not render back button when showBackButton is false', () => {
    fixture.componentRef.setInput('options', {
      title: 'no-back',
    });
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons.length).toBe(0);
  });

  it('should render search input with placeholder when search is provided', () => {
    const textSignal = signal<string>('');
    const setFn = jest.fn();
    fixture.componentRef.setInput('options', {
      title: 'searchable',
      search: { text: textSignal, set: setFn },
    });
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');

    expect(input).toBeTruthy();
    expect(input.getAttribute('placeholder')).toBe('search');
  });

  it('should call search.set when typing into input', () => {
    const textSignal = signal<string>('');
    const setFn = jest.fn();
    fixture.componentRef.setInput('options', {
      title: 'searchable',
      search: { text: textSignal, set: setFn },
    });
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));

    expect(setFn).toHaveBeenCalledWith('hello');
  });

  it('should display search.text() value in input', () => {
    const textSignal = signal<string>('current-query');
    const setFn = jest.fn();
    fixture.componentRef.setInput('options', {
      title: 'searchable',
      search: { text: textSignal, set: setFn },
    });
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;

    expect(input.value).toBe('current-query');
  });

  it('should render one smart-button per endButton entry', () => {
    fixture.componentRef.setInput('options', {
      title: 'with-buttons',
      endButtons: [
        { icon: 'a', text: 'A' },
        { icon: 'b', text: 'B' },
      ],
    });
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('smart-button');

    expect(buttons.length).toBe(2);
  });

  it('should return button options from getButtonOptions', () => {
    const handler = jest.fn();

    const result = component.getButtonOptions({ handler });

    expect(result.click).toBe(handler);
    expect(result.variant).toBe('secondary');
    expect(result.size).toBe('md');
  });

  it('should return a no-op click when no handler is provided', () => {
    const result = component.getButtonOptions({});

    expect(typeof result.click).toBe('function');
    expect(() => result.click()).not.toThrow();
  });

  it('should not throw when options is null', () => {
    fixture.componentRef.setInput(
      'options',
      null as unknown as IPageOptions | null,
    );

    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render nothing in the body section when bodyTpl is not provided', () => {
    fixture.componentRef.setInput('options', { title: 'no-body' });
    fixture.detectChanges();

    const body = fixture.nativeElement.querySelector('#body');
    expect(body).toBeFalsy();
  });

  it('should render options.bodyTpl content in the body section', async () => {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [BodyTplHostComponent],
        providers: [
          { provide: Location, useValue: locationMock },
          { provide: HardwareService, useValue: hardwareMock },
          { provide: AppService, useValue: {} },
        ],
      })
      .overrideComponent(PageStandardComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    const hostFixture = TestBed.createComponent(BodyTplHostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    hostFixture.detectChanges();

    const body = hostFixture.nativeElement.querySelector('#body');
    expect(body).toBeTruthy();
    expect(body.textContent.trim()).toBe('body-content');
  });
});
