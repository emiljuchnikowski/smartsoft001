import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { InfoStandardComponent } from './standard.component';
import { IInfoOptions } from '../../../models';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('@smartsoft001/shared-angular: InfoStandardComponent', () => {
  let fixture: ComponentFixture<InfoStandardComponent>;
  let component: InfoStandardComponent;
  let element: HTMLElement;

  const defaultOptions: IInfoOptions = { text: 'test info text' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoStandardComponent],
    })
      .overrideComponent(InfoStandardComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(InfoStandardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', defaultOptions);
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

  it('should apply relative and inline-block container classes', () => {
    const classes = component.containerClasses();

    expect(classes).toContain('smart:relative');
    expect(classes).toContain('smart:inline-block');
  });

  it('should append external cssClass to container classes', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const classes = component.containerClasses();

    expect(classes).toContain('my-extra-class');
  });
});
