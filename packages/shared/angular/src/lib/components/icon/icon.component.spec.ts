import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconComponent);
  });

  it('should render spinner SVG', () => {
    fixture.componentRef.setInput('name', 'spinner');
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.classList.contains('smart:animate-spin')).toBe(true);
  });

  it('should apply custom cssClass', () => {
    fixture.componentRef.setInput('name', 'spinner');
    fixture.componentRef.setInput('cssClass', 'smart:text-red-500');
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.classList.contains('smart:text-red-500')).toBe(true);
  });
});
