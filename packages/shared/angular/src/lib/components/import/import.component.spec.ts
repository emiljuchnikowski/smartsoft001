import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ImportComponent } from './import.component';

describe('ImportComponent (pro)', () => {
  let fixture: ComponentFixture<ImportComponent>;
  let component: ImportComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportComponent, TranslateModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(ImportComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render smart-button', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('smart-button');
    expect(button).toBeTruthy();
  });

  it('should render upload SVG icon', () => {
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should have hidden file input', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    expect(input).toBeTruthy();
    expect(input.hidden).toBe(true);
  });

  it('should emit file on file selection', () => {
    fixture.detectChanges();
    const emitSpy = jest.spyOn(component.set, 'emit');
    const mockFile = new File(['content'], 'test.json', {
      type: 'application/json',
    });

    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [mockFile] });
    input.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith(mockFile);
  });

  it('should apply the class to the box around the button and the input', () => {
    // Arrange
    fixture.componentRef.setInput('class', 'my-import');

    // Act
    fixture.detectChanges();

    // Assert
    const box: HTMLElement =
      fixture.nativeElement.querySelector('span.my-import');
    expect(box).toBeTruthy();
    expect(box.querySelector('smart-button')).toBeTruthy();
    expect(box.querySelector('input[type="file"]')).toBeTruthy();
  });
});
