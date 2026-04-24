import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconChevronUpComponent } from './chevron-up.component';

describe('IconChevronUpComponent', () => {
  let fixture: ComponentFixture<IconChevronUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconChevronUpComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconChevronUpComponent);
  });

  it('should render a chevron-up SVG', () => {
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('viewBox')).toBe('0 0 20 20');
    expect(svg.querySelector('path').getAttribute('d')).toContain(
      '14.78 11.78',
    );
  });

  it('should apply custom cssClass to SVG', () => {
    fixture.componentRef.setInput('class', 'smart:text-red-500');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.classList.contains('smart:text-red-500')).toBe(true);
  });
});
