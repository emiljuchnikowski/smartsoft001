import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { InfoDefaultComponent } from './default.component';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('InfoDefaultComponent', () => {
  let fixture: ComponentFixture<InfoDefaultComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoDefaultComponent],
    })
      .overrideComponent(InfoDefaultComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(InfoDefaultComponent);
    fixture.componentRef.setInput('text', 'test info text');
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should render the info icon SVG', () => {
    const svg = element.querySelector('svg');

    expect(svg).toBeTruthy();
  });

  it('should not show popover by default', () => {
    const popover = element.querySelector('[data-testid="info-popover"]');

    expect(popover).toBeNull();
  });

  it('should show popover when icon is clicked', () => {
    const button = element.querySelector('button');
    button!.click();
    fixture.detectChanges();

    const popover = element.querySelector('[data-testid="info-popover"]');
    expect(popover).toBeTruthy();
  });

  it('should display text content in popover', () => {
    const button = element.querySelector('button');
    button!.click();
    fixture.detectChanges();

    const popover = element.querySelector('[data-testid="info-popover"]');
    expect(popover!.textContent!.trim()).toBe('test info text');
  });

  it('should close popover when icon is clicked again', () => {
    const button = element.querySelector('button');
    button!.click();
    fixture.detectChanges();

    button!.click();
    fixture.detectChanges();

    const popover = element.querySelector('[data-testid="info-popover"]');
    expect(popover).toBeNull();
  });

  it('should close popover when clicking outside', () => {
    const button = element.querySelector('button');
    button!.click();
    fixture.detectChanges();

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    const popover = element.querySelector('[data-testid="info-popover"]');
    expect(popover).toBeNull();
  });

  it('should have relative inline-block container', () => {
    const container = element.querySelector('div');

    expect(container!.classList.contains('smart:relative')).toBe(true);
    expect(container!.classList.contains('smart:inline-block')).toBe(true);
  });
});
