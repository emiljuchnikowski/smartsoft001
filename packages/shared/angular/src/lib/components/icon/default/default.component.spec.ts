import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconDefaultComponent } from './default.component';

describe('IconDefaultComponent', () => {
  let fixture: ComponentFixture<IconDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconDefaultComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconDefaultComponent);
  });

  it('should render spinner SVG when name is spinner', () => {
    fixture.componentRef.setInput('name', 'spinner');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.classList.contains('smart:animate-spin')).toBe(true);
  });

  it('should render chevron-down SVG when name is chevron-down', () => {
    fixture.componentRef.setInput('name', 'chevron-down');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('viewBox')).toBe('0 0 20 20');
    expect(svg.querySelector('path').getAttribute('d')).toContain('5.22 8.22');
  });

  it('should render chevron-up SVG when name is chevron-up', () => {
    fixture.componentRef.setInput('name', 'chevron-up');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('viewBox')).toBe('0 0 20 20');
    expect(svg.querySelector('path').getAttribute('d')).toContain(
      '14.78 11.78',
    );
  });

  it('should apply custom cssClass to SVG', () => {
    fixture.componentRef.setInput('name', 'spinner');
    fixture.componentRef.setInput('class', 'smart:text-red-500');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.classList.contains('smart:text-red-500')).toBe(true);
  });
});
