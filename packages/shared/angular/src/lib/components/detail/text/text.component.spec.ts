import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FieldType } from '@smartsoft001/models';

import { DetailTextComponent } from './text.component';
import { IDetailOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-text
      [options]="options"
      [class]="cssClass"
    ></smart-detail-text>
  `,
  imports: [DetailTextComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailTextComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render <p> with value from options.item()[key]', () => {
    host.options = {
      key: 'name',
      item: signal({ name: 'Hello World' } as any),
      options: { type: FieldType.text },
    };
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p).toBeTruthy();
    expect(p.innerHTML).toContain('Hello World');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'name',
      item: signal(undefined),
      options: { type: FieldType.text },
    };
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p).toBeFalsy();
  });

  it('should append cssClass to the <p> element', () => {
    host.options = {
      key: 'name',
      item: signal({ name: 'Hello' } as any),
      options: { type: FieldType.text },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');

    expect(p.className).toContain('my-custom-class');
    expect(p.className).toContain('smart:text-sm');
  });
});
