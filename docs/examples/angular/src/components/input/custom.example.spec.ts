import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { StyleService } from '@smartsoft001/angular';

import { InputCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: InputCustomExampleComponent', () => {
  let fixture: ComponentFixture<InputCustomExampleComponent>;
  let component: InputCustomExampleComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCustomExampleComponent, TranslateModule.forRoot()],
      // An application gets StyleService from SharedServicesModule.
      providers: [StyleService],
    }).compileComponents();

    fixture = TestBed.createComponent(InputCustomExampleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should dispatch the text field to the custom input implementation', () => {
    expect(element.querySelector('docs-custom-input-text')).toBeTruthy();
    expect(element.querySelector('smart-input-text')).toBeNull();
  });

  it('should render the label through the model label pipe', () => {
    // No translations and no IModelLabelProvider are registered here, so the
    // pipe falls back to the MODEL.<key> translation key.
    expect(element.querySelector('.docs-input__label')?.textContent).toContain(
      'MODEL.nickname',
    );
  });

  it('should mark the field as required because the control carries the validator', () => {
    expect(element.querySelector('.docs-input__required')).toBeTruthy();
  });

  it('should write user input into the bound control', () => {
    const input = element.querySelector(
      '.docs-input__field',
    ) as HTMLInputElement;

    input.value = 'ada';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.control.value).toBe('ada');
  });
});
