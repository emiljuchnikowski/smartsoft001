import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconChevronDownComponent } from './chevron-down.component';

describe('IconChevronDownComponent', () => {
  let fixture: ComponentFixture<IconChevronDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconChevronDownComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconChevronDownComponent);
  });

  it('should render a chevron-down SVG', () => {
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('viewBox')).toBe('0 0 20 20');
    expect(svg.querySelector('path').getAttribute('d')).toContain('5.22 8.22');
  });

  it('should apply custom cssClass to SVG', () => {
    fixture.componentRef.setInput('class', 'smart:text-red-500');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.classList.contains('smart:text-red-500')).toBe(true);
  });
});
