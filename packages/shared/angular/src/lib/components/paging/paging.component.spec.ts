import { Component, input, output, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { PAGING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { PagingBaseComponent } from './base/base.component';
import { PagingComponent } from './paging.component';
import { PagingStandardComponent } from './standard/standard.component';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Component({
  selector: 'smart-test-injected-paging',
  template: '<nav class="injected">injected</nav>',
})
class MockInjectedPagingComponent extends PagingBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
  override pageChange = output<number>();
}

describe('@smartsoft001/shared-angular: PagingComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<PagingComponent>;
    let component: PagingComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PagingComponent],
      })
        .overrideComponent(PagingStandardComponent, {
          remove: { imports: [TranslatePipe] },
          add: { imports: [MockTranslatePipe] },
        })
        .compileComponents();

      fixture = TestBed.createComponent(PagingComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('totalPages', 5);
      fixture.componentRef.setInput('totalItems', 42);
      fixture.detectChanges();
    });

    it('should render smart-paging-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-paging-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should pass currentPage to standard component', () => {
      fixture.componentRef.setInput('currentPage', 3);
      fixture.detectChanges();

      expect(component.currentPage()).toBe(3);
    });

    it('should pass totalPages to standard component', () => {
      fixture.componentRef.setInput('totalPages', 10);
      fixture.detectChanges();

      expect(component.totalPages()).toBe(10);
    });

    it('should pass pageSize to standard component', () => {
      fixture.componentRef.setInput('pageSize', 25);
      fixture.detectChanges();

      expect(component.pageSize()).toBe(25);
    });

    it('should pass totalItems to standard component', () => {
      fixture.componentRef.setInput('totalItems', 123);
      fixture.detectChanges();

      expect(component.totalItems()).toBe(123);
    });

    it('should pass cssClass via [class] alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate pageChange from standard component', () => {
      const emitSpy = jest.spyOn(component.pageChange, 'emit');
      fixture.componentRef.setInput('currentPage', 1);
      fixture.detectChanges();

      const pageButtons = Array.from(
        fixture.nativeElement.querySelectorAll('button'),
      ) as HTMLButtonElement[];
      const target = pageButtons.find((b) => b.textContent?.trim() === '2');
      target?.click();

      expect(emitSpy).toHaveBeenCalledWith(2);
    });
  });

  describe('with PAGING_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<PagingComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PagingComponent, MockInjectedPagingComponent],
        providers: [
          {
            provide: PAGING_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedPagingComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PagingComponent);
      fixture.componentRef.setInput('totalPages', 5);
      fixture.detectChanges();
    });

    it('should render injected component when PAGING_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector('nav.injected');

      expect(injected).toBeTruthy();
    });

    it('should not render smart-paging-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-paging-standard',
      );

      expect(standard).toBeFalsy();
    });
  });
});
