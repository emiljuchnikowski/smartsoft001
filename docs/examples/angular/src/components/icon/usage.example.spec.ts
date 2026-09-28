import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: IconUsageExampleComponent', () => {
  let fixture: ComponentFixture<IconUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the built-in glyph named in the class', () => {
    const glyph = fixture.nativeElement.querySelector(
      'smart-icon-chevron-down',
    );

    expect(glyph).not.toBeNull();
  });

  it('should forward the icon class to the glyph svg', () => {
    const svg: SVGElement = fixture.nativeElement.querySelector(
      'smart-icon-chevron-down svg',
    );

    expect(svg.getAttribute('class')).toContain('smart:text-gray-500');
  });

  it('should render the custom svg passed as a template', () => {
    const custom = fixture.nativeElement.querySelector('[data-icon="heart"]');

    expect(custom).not.toBeNull();
  });
});
