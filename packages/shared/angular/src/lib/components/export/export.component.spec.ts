import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ExportComponent } from './export.component';

describe('ExportComponent (pro)', () => {
  let fixture: ComponentFixture<ExportComponent>;
  let component: ExportComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportComponent, TranslateModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fixture.componentRef.setInput('handler', () => {});
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render smart-button', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fixture.componentRef.setInput('handler', () => {});
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('smart-button');
    expect(button).toBeTruthy();
  });

  it('should render download SVG icon', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fixture.componentRef.setInput('handler', () => {});
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should call handler with value on button click', async () => {
    const handler = jest.fn();
    fixture.componentRef.setInput('handler', handler);
    fixture.componentRef.setInput('value', { data: 'test' });
    fixture.detectChanges();

    await component.buttonOptions.click();
    expect(handler).toHaveBeenCalledWith({ data: 'test' }, undefined);
  });

  it('should not call handler when value is undefined', async () => {
    const handler = jest.fn();
    fixture.componentRef.setInput('handler', handler);
    fixture.detectChanges();

    await component.buttonOptions.click();
    expect(handler).not.toHaveBeenCalled();
  });

  it('should pass fileName to the handler on button click', async () => {
    const handler = jest.fn();
    fixture.componentRef.setInput('handler', handler);
    fixture.componentRef.setInput('value', { data: 'test' });
    fixture.componentRef.setInput('fileName', 'report.csv');
    fixture.detectChanges();

    await component.buttonOptions.click();

    expect(handler).toHaveBeenCalledWith({ data: 'test' }, 'report.csv');
  });

  it('should hide the icon from assistive technology', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fixture.componentRef.setInput('handler', () => {});
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');

    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('should give the button a visually hidden accessible name', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fixture.componentRef.setInput('handler', () => {});
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector(
      'button .smart\\:sr-only',
    ) as HTMLElement;

    expect(label.textContent?.trim()).toBe('Export');
  });

  it('should apply cssClass to the rendered button', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fixture.componentRef.setInput('handler', () => {});
    fixture.componentRef.setInput('class', 'my-export');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button.classList).toContain('my-export');
  });
});
