import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FieldType } from '@smartsoft001/models';

import { DetailEnumPresetComponent } from './preset.component';
import { IDetailOptions } from '../../../../models';

@Component({
  selector: 'smart-test-host',
  template: `
    <smart-detail-enum-preset
      [options]="options"
      [class]="cssClass"
    ></smart-detail-enum-preset>
  `,
  imports: [DetailEnumPresetComponent],
})
class TestHostComponent {
  options: IDetailOptions<any> | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DetailEnumPresetComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should render a single badge for a single value', () => {
    host.options = {
      key: 'status',
      item: signal({ status: 'active' } as any),
      options: { type: FieldType.enum },
    };
    fixture.detectChanges();

    const badges = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="badge"]',
    );

    expect(badges.length).toBe(1);
    expect(badges[0].textContent).toContain('active');
  });

  it('should render N badges for an array of N values', () => {
    host.options = {
      key: 'roles',
      item: signal({ roles: ['admin', 'editor', 'viewer'] } as any),
      options: { type: FieldType.enum },
    };
    fixture.detectChanges();

    const badges = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-role="badge"]',
    );

    expect(badges.length).toBe(3);
  });

  it('should apply the soft blue badge recipe to each badge', () => {
    host.options = {
      key: 'status',
      item: signal({ status: 'active' } as any),
      options: { type: FieldType.enum },
    };
    fixture.detectChanges();

    const badge = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="badge"]',
    ) as HTMLElement;

    expect(badge.className).toContain('smart:bg-blue-100');
    expect(badge.className).toContain('smart:text-blue-800');
  });

  it('should render values through the translate pipe', () => {
    host.options = {
      key: 'status',
      item: signal({ status: 'active' } as any),
      options: { type: FieldType.enum },
    };
    fixture.detectChanges();

    const badge = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="badge"]',
    ) as HTMLElement;

    expect(badge.textContent?.trim()).toBe('active');
  });

  it('should render nothing when options.item() is undefined', () => {
    host.options = {
      key: 'status',
      item: signal(undefined),
      options: { type: FieldType.enum },
    };
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="badges"]',
    );

    expect(container).toBeFalsy();
  });

  it('should append cssClass to the badges container', () => {
    host.options = {
      key: 'status',
      item: signal({ status: 'active' } as any),
      options: { type: FieldType.enum },
    };
    host.cssClass = 'my-custom-class';
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="badges"]',
    ) as HTMLElement;

    expect(container.className).toContain('my-custom-class');
    expect(container.className).toContain('smart:flex');
  });
});
