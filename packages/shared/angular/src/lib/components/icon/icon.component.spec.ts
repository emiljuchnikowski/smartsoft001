import { Component, signal, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { IconName } from './base/base.component';
import { IconComponent } from './icon.component';

@Component({
  selector: 'smart-test-icon-host',
  template: `
    <ng-template #custom>
      <svg data-testid="custom-svg" viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="4" />
      </svg>
    </ng-template>
    <smart-icon [name]="name()" [template]="customTpl()" />
  `,
  imports: [IconComponent],
})
class TestHostComponent {
  customTpl = viewChild.required<TemplateRef<unknown>>('custom');
  name = signal<IconName | undefined>(undefined);
}

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconComponent);
  });

  it('should render spinner variant when name is spinner', () => {
    fixture.componentRef.setInput('name', 'spinner');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('smart-icon-spinner'),
    ).toBeTruthy();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.classList.contains('smart:animate-spin')).toBe(true);
  });

  it('should render chevron-down variant when name is chevron-down', () => {
    fixture.componentRef.setInput('name', 'chevron-down');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('smart-icon-chevron-down'),
    ).toBeTruthy();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.querySelector('path').getAttribute('d')).toContain('5.22 8.22');
  });

  it('should render chevron-up variant when name is chevron-up', () => {
    fixture.componentRef.setInput('name', 'chevron-up');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('smart-icon-chevron-up'),
    ).toBeTruthy();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.querySelector('path').getAttribute('d')).toContain(
      '14.78 11.78',
    );
  });

  it('should pass cssClass through to rendered variant SVG', () => {
    fixture.componentRef.setInput('name', 'spinner');
    fixture.componentRef.setInput('class', 'smart:text-red-500');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.classList.contains('smart:text-red-500')).toBe(true);
  });

  it('should render nothing when no name and no template provided', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('smart-icon-spinner'),
    ).toBeNull();
  });

  it('should render custom template when provided', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const svg = hostFixture.nativeElement.querySelector(
      'svg[data-testid="custom-svg"]',
    );
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('viewBox')).toBe('0 0 10 10');
  });

  it('should prefer custom template over name when both provided', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.componentInstance.name.set('spinner');
    hostFixture.detectChanges();

    const svgs = hostFixture.nativeElement.querySelectorAll('svg');
    expect(svgs).toHaveLength(1);
    expect(svgs[0].getAttribute('data-testid')).toBe('custom-svg');
    expect(
      hostFixture.nativeElement.querySelector('smart-icon-spinner'),
    ).toBeNull();
  });
});
