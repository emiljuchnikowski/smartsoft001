import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@smartsoft001/models';

import { DetailEmailComponent } from './email.component';
import { IDetailOptions } from '../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-email
      [options]="options"
      [class]="cssClass"
    ></smart-detail-email>
  `,
  imports: [DetailEmailComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailEmailComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render <a> with mailto href and value from options.item()[key]', () => {
    host.options = {
      key: 'mail',
      item: signal({ mail: 'a@b.c' } as any),
      options: { type: FieldType.email },
    };
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a');

    expect(a).toBeTruthy();
    expect(a.getAttribute('href')).toBe('mailto:a@b.c');
    expect(a.textContent).toContain('a@b.c');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'mail',
      item: signal(undefined),
      options: { type: FieldType.email },
    };
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a');

    expect(a).toBeFalsy();
  });

  it('should append cssClass to the <a> element', () => {
    host.options = {
      key: 'mail',
      item: signal({ mail: 'a@b.c' } as any),
      options: { type: FieldType.email },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a');

    expect(a.className).toContain('my-custom-class');
    expect(a.className).toContain('smart:text-indigo-600');
  });
});
