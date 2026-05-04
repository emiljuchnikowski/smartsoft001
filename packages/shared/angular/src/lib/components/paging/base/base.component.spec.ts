import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagingBaseComponent } from './base.component';

@Component({
  selector: 'smart-test-paging',
  template: '',
})
class TestPagingComponent extends PagingBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-paging
    [currentPage]="currentPage"
    [totalPages]="totalPages"
    [pageSize]="pageSize"
    [totalItems]="totalItems"
    [class]="cssClass"
  />`,
  imports: [TestPagingComponent],
})
class TestHostComponent {
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  totalItems = 0;
  cssClass = '';
}

describe('PagingBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let comp: TestPagingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    comp = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(comp).toBeInstanceOf(PagingBaseComponent);
  });

  describe('default values', () => {
    it('should default currentPage to 1', () => {
      expect(comp.currentPage()).toBe(1);
    });

    it('should default totalPages to 1', () => {
      expect(comp.totalPages()).toBe(1);
    });

    it('should default pageSize to 10', () => {
      expect(comp.pageSize()).toBe(10);
    });

    it('should default totalItems to 0', () => {
      expect(comp.totalItems()).toBe(0);
    });

    it('should default cssClass to empty string', () => {
      expect(comp.cssClass()).toBe('');
    });
  });

  describe('cssClass alias', () => {
    it('should accept cssClass via class alias', async () => {
      fixture.componentInstance.cssClass = 'custom-class';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.cssClass()).toBe('custom-class');
    });
  });

  describe('showingFrom', () => {
    it('should return 0 when totalItems is 0', () => {
      expect(comp.showingFrom()).toBe(0);
    });

    it('should return 1 for first page', async () => {
      fixture.componentInstance.totalItems = 50;
      fixture.componentInstance.currentPage = 1;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.showingFrom()).toBe(1);
    });

    it('should return 11 for second page with pageSize 10', async () => {
      fixture.componentInstance.totalItems = 50;
      fixture.componentInstance.currentPage = 2;
      fixture.componentInstance.pageSize = 10;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.showingFrom()).toBe(11);
    });
  });

  describe('showingTo', () => {
    it('should return 0 when totalItems is 0', () => {
      expect(comp.showingTo()).toBe(0);
    });

    it('should return pageSize for first full page', async () => {
      fixture.componentInstance.totalItems = 50;
      fixture.componentInstance.currentPage = 1;
      fixture.componentInstance.pageSize = 10;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.showingTo()).toBe(10);
    });

    it('should return totalItems when last page is not full', async () => {
      fixture.componentInstance.totalItems = 25;
      fixture.componentInstance.currentPage = 3;
      fixture.componentInstance.pageSize = 10;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.showingTo()).toBe(25);
    });
  });

  describe('canGoBack', () => {
    it('should return false on first page', () => {
      expect(comp.canGoBack()).toBe(false);
    });

    it('should return true when currentPage > 1', async () => {
      fixture.componentInstance.currentPage = 2;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.canGoBack()).toBe(true);
    });
  });

  describe('canGoForward', () => {
    it('should return false when on last page', () => {
      expect(comp.canGoForward()).toBe(false);
    });

    it('should return true when currentPage < totalPages', async () => {
      fixture.componentInstance.totalPages = 5;
      fixture.componentInstance.currentPage = 3;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.canGoForward()).toBe(true);
    });
  });

  describe('pages computed', () => {
    it('should return [1] for single page', () => {
      expect(comp.pages()).toEqual([1]);
    });

    it('should return all pages when totalPages <= 7', async () => {
      fixture.componentInstance.totalPages = 5;
      fixture.componentInstance.currentPage = 3;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.pages()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should show ellipsis for page 5 of 10', async () => {
      fixture.componentInstance.totalPages = 10;
      fixture.componentInstance.currentPage = 5;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.pages()).toEqual([1, '...', 4, 5, 6, '...', 10]);
    });

    it('should show ellipsis only after start when near beginning', async () => {
      fixture.componentInstance.totalPages = 10;
      fixture.componentInstance.currentPage = 1;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.pages()).toEqual([1, 2, '...', 10]);
    });

    it('should show ellipsis only before end when near end', async () => {
      fixture.componentInstance.totalPages = 10;
      fixture.componentInstance.currentPage = 10;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.pages()).toEqual([1, '...', 9, 10]);
    });

    it('should handle page 2 of 10', async () => {
      fixture.componentInstance.totalPages = 10;
      fixture.componentInstance.currentPage = 2;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.pages()).toEqual([1, 2, 3, '...', 10]);
    });

    it('should handle page 9 of 10', async () => {
      fixture.componentInstance.totalPages = 10;
      fixture.componentInstance.currentPage = 9;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(comp.pages()).toEqual([1, '...', 8, 9, 10]);
    });
  });

  describe('goToPage', () => {
    it('should emit pageChange when page is valid', () => {
      const spy = jest.fn();
      comp.pageChange.subscribe(spy);

      fixture.componentInstance.totalPages = 5;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      comp.goToPage(3);

      expect(spy).toHaveBeenCalledWith(3);
    });

    it('should not emit pageChange when page is less than 1', () => {
      const spy = jest.fn();
      comp.pageChange.subscribe(spy);

      comp.goToPage(0);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit pageChange when page is greater than totalPages', () => {
      const spy = jest.fn();
      comp.pageChange.subscribe(spy);

      fixture.componentInstance.totalPages = 5;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      comp.goToPage(6);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('nextPage', () => {
    it('should emit pageChange with next page number', async () => {
      const spy = jest.fn();
      comp.pageChange.subscribe(spy);

      fixture.componentInstance.totalPages = 5;
      fixture.componentInstance.currentPage = 2;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      comp.nextPage();

      expect(spy).toHaveBeenCalledWith(3);
    });

    it('should not emit when on last page', () => {
      const spy = jest.fn();
      comp.pageChange.subscribe(spy);

      comp.nextPage();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('previousPage', () => {
    it('should emit pageChange with previous page number', async () => {
      const spy = jest.fn();
      comp.pageChange.subscribe(spy);

      fixture.componentInstance.totalPages = 5;
      fixture.componentInstance.currentPage = 3;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      comp.previousPage();

      expect(spy).toHaveBeenCalledWith(2);
    });

    it('should not emit when on first page', () => {
      const spy = jest.fn();
      comp.pageChange.subscribe(spy);

      comp.previousPage();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
