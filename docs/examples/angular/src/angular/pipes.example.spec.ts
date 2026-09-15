import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipesExampleComponent } from './pipes.example';

describe('docs-examples-angular: PipesExampleComponent', () => {
  let fixture: ComponentFixture<PipesExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PipesExampleComponent);
    fixture.detectChanges();
  });

  it('should render the title slugified by smartSlug', () => {
    const slug = fixture.nativeElement.querySelector('[data-testid="slug"]');

    expect(slug.textContent.trim()).toBe('zazolc-gesla-jazn');
  });

  it('should render one row per enum key produced by smartEnumToList', () => {
    const rows = fixture.nativeElement.querySelectorAll('li');

    expect(rows).toHaveLength(3);
  });

  it('should render the enum keys in declaration order', () => {
    const rows: HTMLLIElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('li'),
    );

    expect(rows.map((row) => row.textContent?.trim())).toEqual([
      'draft',
      'published',
      'archived',
    ]);
  });
});
