import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSpinnerComponent } from './spinner.component';

describe('IconSpinnerComponent', () => {
  let fixture: ComponentFixture<IconSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSpinnerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconSpinnerComponent);
  });

  it('should render an animated spinner SVG', () => {
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.classList.contains('smart:animate-spin')).toBe(true);
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('should apply custom cssClass to SVG', () => {
    fixture.componentRef.setInput('class', 'smart:text-red-500');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.classList.contains('smart:text-red-500')).toBe(true);
  });
});
