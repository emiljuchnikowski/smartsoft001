import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ICardOptions } from '../../models';
import { CARD_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { CardBaseComponent } from './base/base.component';
import { CardComponent } from './card.component';

@Component({
  selector: 'smart-test-injected-card',
  template: '<div class="injected-card">injected</div>',
})
class MockInjectedComponent extends CardBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-card
      [options]="options"
      [hasHeader]="hasHeader"
      [hasFooter]="hasFooter"
      [class]="cssClass"
    >
      <div cardHeader class="projected-header">HEADER</div>
      <div class="projected-body">BODY</div>
      <div cardFooter class="projected-footer">FOOTER</div>
    </smart-card>
  `,
  imports: [CardComponent],
})
class TestHostComponent {
  options: ICardOptions | undefined = undefined;
  hasHeader = false;
  hasFooter = false;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: CardComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<CardComponent>;
    let component: CardComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-card-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-card-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should pass options to standard component', () => {
      const opts: ICardOptions = { title: 'Hello', grayBody: true };
      fixture.componentRef.setInput('options', opts);
      fixture.detectChanges();

      expect(component.options()).toEqual(opts);
    });

    it('should pass hasHeader to standard component', () => {
      fixture.componentRef.setInput('hasHeader', true);
      fixture.detectChanges();

      expect(component.hasHeader()).toBe(true);
    });

    it('should pass hasFooter to standard component', () => {
      fixture.componentRef.setInput('hasFooter', true);
      fixture.detectChanges();

      expect(component.hasFooter()).toBe(true);
    });

    it('should pass cssClass to standard component', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });
  });

  describe('content projection (no token)', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.componentInstance.hasHeader = true;
      hostFixture.componentInstance.hasFooter = true;
      hostFixture.detectChanges();
    });

    it('should project body content', () => {
      const body = hostFixture.nativeElement.querySelector('.projected-body');

      expect(body).toBeTruthy();
      expect(body.textContent).toContain('BODY');
    });

    it('should project header content when hasHeader is true', () => {
      const header =
        hostFixture.nativeElement.querySelector('.projected-header');

      expect(header).toBeTruthy();
      expect(header.textContent).toContain('HEADER');
    });

    it('should project footer content when hasFooter is true', () => {
      const footer =
        hostFixture.nativeElement.querySelector('.projected-footer');

      expect(footer).toBeTruthy();
      expect(footer.textContent).toContain('FOOTER');
    });
  });

  describe('with CARD_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<CardComponent>;
    let component: CardComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardComponent, MockInjectedComponent],
        providers: [
          {
            provide: CARD_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render injected component when CARD_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector('.injected-card');

      expect(injected).toBeTruthy();
    });

    it('should NOT render smart-card-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-card-standard',
      );

      expect(standard).toBeFalsy();
    });

    it('should expose componentInputs with options, hasHeader, hasFooter, cssClass', () => {
      const opts: ICardOptions = { title: 'Hi' };
      fixture.componentRef.setInput('options', opts);
      fixture.componentRef.setInput('hasHeader', true);
      fixture.componentRef.setInput('hasFooter', true);
      fixture.componentRef.setInput('class', 'my-class');
      fixture.detectChanges();

      const inputs = component.componentInputs();

      expect(inputs['options']).toEqual(opts);
      expect(inputs['hasHeader']).toBe(true);
      expect(inputs['hasFooter']).toBe(true);
      expect(inputs['cssClass']).toBe('my-class');
      expect(inputs['headerTpl']).toBeDefined();
      expect(inputs['bodyTpl']).toBeDefined();
      expect(inputs['footerTpl']).toBeDefined();
    });
  });
});
