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
    expect(handler).toHaveBeenCalledWith({ data: 'test' });
  });

  it('should not call handler when value is undefined', async () => {
    const handler = jest.fn();
    fixture.componentRef.setInput('handler', handler);
    fixture.detectChanges();

    await component.buttonOptions.click();
    expect(handler).not.toHaveBeenCalled();
  });
});
