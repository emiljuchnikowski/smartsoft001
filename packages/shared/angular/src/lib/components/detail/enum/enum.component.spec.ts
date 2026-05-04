import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FieldType } from '@smartsoft001/models';

import { DetailEnumComponent } from './enum.component';
import { IDetailOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-enum
      [options]="options"
      [class]="cssClass"
    ></smart-detail-enum>
  `,
  imports: [DetailEnumComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailEnumComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render <p> with value(s) from options.item()[key]', () => {
    host.options = {
      key: 'status',
      item: signal({ status: 'active' } as any),
      options: { type: FieldType.enum },
    };
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p).toBeTruthy();
    expect(p.textContent).toContain('active');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'status',
      item: signal(undefined),
      options: { type: FieldType.enum },
    };
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p).toBeFalsy();
  });

  it('should append cssClass to the <p> element', () => {
    host.options = {
      key: 'status',
      item: signal({ status: 'active' } as any),
      options: { type: FieldType.enum },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p.className).toContain('my-custom-class');
    expect(p.className).toContain('smart:text-sm');
  });
});
