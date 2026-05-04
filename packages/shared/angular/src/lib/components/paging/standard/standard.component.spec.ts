import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { PagingStandardComponent } from './standard.component';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('@smartsoft001/shared-angular: PagingStandardComponent', () => {
  let fixture: ComponentFixture<PagingStandardComponent>;
  let component: PagingStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagingStandardComponent],
    })
      .overrideComponent(PagingStandardComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PagingStandardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('totalPages', 5);
    fixture.componentRef.setInput('totalItems', 42);
    fixture.detectChanges();
  });

  it('should render a nav element', () => {
    const nav = fixture.nativeElement.querySelector('nav');

    expect(nav).toBeTruthy();
  });

  it('should render prev and next buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('should disable prev button on first page', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const prevButton = fixture.nativeElement.querySelector(
      'button:first-of-type',
    );

    expect(prevButton.disabled).toBe(true);
  });

  it('should disable next button on last page', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const nextButton = buttons[buttons.length - 1];

    expect(nextButton.disabled).toBe(true);
  });

  it('should emit pageChange when a page number is clicked', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const pageButtons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const target = pageButtons.find((b) => b.textContent?.trim() === '3');
    target?.click();

    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('should emit pageChange on next click', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const nextButton = buttons[buttons.length - 1] as HTMLButtonElement;
    nextButton.click();

    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('should emit pageChange on previous click', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    fixture.componentRef.setInput('currentPage', 3);
    fixture.detectChanges();

    const prevButton = fixture.nativeElement.querySelector(
      'button:first-of-type',
    ) as HTMLButtonElement;
    prevButton.click();

    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('should mark active page with aria-current', () => {
    fixture.componentRef.setInput('currentPage', 3);
    fixture.detectChanges();

    const activeButton = fixture.nativeElement.querySelector(
      'button[aria-current="page"]',
    );

    expect(activeButton).toBeTruthy();
    expect(activeButton.textContent.trim()).toBe('3');
  });

  it('should render ellipsis when pages exceed 7', () => {
    fixture.componentRef.setInput('totalPages', 20);
    fixture.componentRef.setInput('currentPage', 10);
    fixture.detectChanges();

    const ellipsis = fixture.nativeElement.querySelector('span');

    expect(ellipsis?.textContent).toContain('...');
  });

  it('should apply external cssClass via [class] alias', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    expect(component.wrapperClasses()).toContain('my-extra-class');
  });
});
