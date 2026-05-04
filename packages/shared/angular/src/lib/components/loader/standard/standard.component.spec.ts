import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderStandardComponent } from './standard.component';

describe('@smartsoft001/shared-angular: LoaderStandardComponent', () => {
  let fixture: ComponentFixture<LoaderStandardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderStandardComponent);
    element = fixture.nativeElement;
  });

  it('should not render SVG by default (show defaults to false)', () => {
    fixture.detectChanges();

    const svg = element.querySelector('svg');

    expect(svg).toBeNull();
  });

  it('should render an SVG when show input is set to true', () => {
    fixture.componentRef.setInput('show', true);
    fixture.detectChanges();

    const svg = element.querySelector('svg');

    expect(svg).toBeTruthy();
  });

  it('should hide SVG again when show is toggled back to false', () => {
    fixture.componentRef.setInput('show', true);
    fixture.detectChanges();

    fixture.componentRef.setInput('show', false);
    fixture.detectChanges();

    const svg = element.querySelector('svg');

    expect(svg).toBeNull();
  });

  it('should include smart:animate-spin in the rendered SVG class attribute', () => {
    fixture.componentRef.setInput('show', true);
    fixture.detectChanges();

    const svg = element.querySelector('svg');

    expect(svg!.getAttribute('class')).toContain('smart:animate-spin');
  });

  it('should include default size class smart:size-6 (md) when no size input is set', () => {
    fixture.componentRef.setInput('show', true);
    fixture.detectChanges();

    const svg = element.querySelector('svg');

    expect(svg!.getAttribute('class')).toContain('smart:size-6');
  });

  it('should apply smart:size-10 class when size input is xl', () => {
    fixture.componentRef.setInput('show', true);
    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();

    const svg = element.querySelector('svg');

    expect(svg!.getAttribute('class')).toContain('smart:size-10');
  });

  it('should apply smart:text-red-600 class when color input is red', () => {
    fixture.componentRef.setInput('show', true);
    fixture.componentRef.setInput('color', 'red');
    fixture.detectChanges();

    const svg = element.querySelector('svg');

    expect(svg!.getAttribute('class')).toContain('smart:text-red-600');
  });

  it('should append external class alias to the rendered SVG class attribute', () => {
    fixture.componentRef.setInput('show', true);
    fixture.componentRef.setInput('class', 'my-loader');
    fixture.detectChanges();

    const svg = element.querySelector('svg');

    expect(svg!.getAttribute('class')).toContain('my-loader');
  });
});
