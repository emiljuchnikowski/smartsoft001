import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InfoCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: InfoCustomExampleComponent', () => {
  let fixture: ComponentFixture<InfoCustomExampleComponent>;
  let element: HTMLElement;

  const trigger = () =>
    element.querySelector<HTMLButtonElement>('.docs-info__trigger');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // The custom info renders its text through the translate pipe, exactly
      // like InfoStandardComponent does.
      imports: [InfoCustomExampleComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom info through the wrapper instead of the standard one', () => {
    expect(element.querySelector('smart-info docs-custom-info')).toBeTruthy();
    expect(element.querySelector('smart-info-standard')).toBeNull();
    expect(trigger()).toBeTruthy();
    expect(element.querySelector('.docs-info__popover')).toBeNull();
  });

  it('should show the text after the trigger is clicked', () => {
    trigger()?.click();
    fixture.detectChanges();

    expect(element.querySelector('.docs-info__popover')?.textContent).toContain(
      'Enter your primary email address.',
    );
  });

  it('should close the popover on a click outside the component', () => {
    trigger()?.click();
    fixture.detectChanges();

    document.body.click();
    fixture.detectChanges();

    expect(element.querySelector('.docs-info__popover')).toBeNull();
  });
});
