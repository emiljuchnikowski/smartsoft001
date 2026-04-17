import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateEditStandardComponent } from './standard/standard.component';

describe('DateEditStandardComponent', () => {
  let fixture: ComponentFixture<DateEditStandardComponent>;
  let component: DateEditStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateEditStandardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DateEditStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render 8 input fields', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(8);
  });

  it('should render 2 separator dashes', () => {
    const separators = fixture.nativeElement.querySelectorAll('span');
    const dashes = Array.from(separators).filter(
      (el: any) => el.textContent.trim() === '-',
    );
    expect(dashes.length).toBe(2);
  });

  it('should render DD, MM, RRRR labels', () => {
    const labels = fixture.nativeElement.querySelectorAll('span');
    const texts = Array.from(labels).map((el: any) => el.textContent.trim());
    expect(texts).toContain('DD');
    expect(texts).toContain('MM');
    expect(texts).toContain('RRRR');
  });

  it('should have Tailwind classes on inputs', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.classList.contains('smart:w-8')).toBe(true);
    expect(input.classList.contains('smart:h-10')).toBe(true);
    expect(input.classList.contains('smart:text-center')).toBe(true);
    expect(input.classList.contains('smart:border')).toBe(true);
    expect(input.classList.contains('smart:rounded-md')).toBe(true);
  });

  it('should have dark mode classes on inputs', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.classList.contains('dark:smart:bg-gray-800')).toBe(true);
    expect(input.classList.contains('dark:smart:text-white')).toBe(true);
  });

  it('should apply invalid classes when date is invalid', () => {
    component.validDate = false;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.classList.contains('smart:border-red-500')).toBe(true);
  });
});
