import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FieldType } from '@smartsoft001/models';

import { IDetailOptions } from '../../models';
import { IModelLabelProvider } from '../../providers';
import { DETAIL_FIELD_COMPONENTS_TOKEN } from '../../shared.inectors';
import { DetailBaseComponent } from './base/base.component';
import { DetailComponent } from './detail.component';

@Component({
  selector: 'smart-test-detail-injected',
  template: '<div class="injected-detail">injected</div>',
})
class MockInjectedComponent extends DetailBaseComponent<any> {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return signal('Mock Label');
  }
}

function createOptions<T>(
  partial: Partial<IDetailOptions<T>>,
): IDetailOptions<T> {
  return {
    key: 'name',
    item: signal({ name: 'test' } as unknown as T),
    options: { type: FieldType.text },
    ...partial,
  };
}

describe('@smartsoft001/shared-angular: DetailComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<DetailComponent<any>>;
    let component: DetailComponent<any>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DetailComponent, TranslateModule.forRoot()],
        providers: [
          { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DetailComponent);
      component = fixture.componentInstance;
    });

    it('should render <smart-detail-text> for FieldType.text', () => {
      fixture.componentRef.setInput(
        'options',
        createOptions({ options: { type: FieldType.text } }),
      );
      fixture.componentRef.setInput('type', class {});
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('smart-detail-text');

      expect(el).toBeTruthy();
    });

    it('should render <smart-detail-email> for FieldType.email', () => {
      fixture.componentRef.setInput(
        'options',
        createOptions({
          key: 'email',
          item: signal({ email: 'a@b.c' }),
          options: { type: FieldType.email },
        }),
      );
      fixture.componentRef.setInput('type', class {});
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('smart-detail-email');

      expect(el).toBeTruthy();
    });

    it('should render <smart-detail-color> for FieldType.color', () => {
      fixture.componentRef.setInput(
        'options',
        createOptions({
          key: 'color',
          item: signal({ color: '#fff' }),
          options: { type: FieldType.color },
        }),
      );
      fixture.componentRef.setInput('type', class {});
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('smart-detail-color');

      expect(el).toBeTruthy();
    });

    it('should render skeleton div when options.item() returns undefined', () => {
      fixture.componentRef.setInput(
        'options',
        createOptions({
          item: signal(undefined),
          options: { type: FieldType.text },
        }),
      );
      fixture.componentRef.setInput('type', class {});
      fixture.detectChanges();

      const skeleton = fixture.nativeElement.querySelector(
        '.smart\\:animate-pulse',
      );

      expect(skeleton).toBeTruthy();
      expect(skeleton.tagName.toLowerCase()).toBe('div');
    });

    it('should render label in <span> with smart:text-gray-500 class', () => {
      fixture.componentRef.setInput(
        'options',
        createOptions({ options: { type: FieldType.text } }),
      );
      fixture.componentRef.setInput('type', class {});
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector(
        'span.smart\\:text-gray-500',
      );

      expect(span).toBeTruthy();
      expect(span.textContent).toContain('Mock Label');
    });
  });

  describe('with DETAIL_FIELD_COMPONENTS_TOKEN override', () => {
    let fixture: ComponentFixture<DetailComponent<any>>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          DetailComponent,
          MockInjectedComponent,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
          {
            provide: DETAIL_FIELD_COMPONENTS_TOKEN,
            useValue: { [FieldType.text]: MockInjectedComponent },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DetailComponent);
    });

    it('should render injected component for FieldType.text instead of DetailTextComponent', () => {
      fixture.componentRef.setInput(
        'options',
        createOptions({ options: { type: FieldType.text } }),
      );
      fixture.componentRef.setInput('type', class {});
      fixture.detectChanges();

      const injected = fixture.nativeElement.querySelector('.injected-detail');
      const defaultText =
        fixture.nativeElement.querySelector('smart-detail-text');

      expect(injected).toBeTruthy();
      expect(defaultText).toBeFalsy();
    });
  });
});
