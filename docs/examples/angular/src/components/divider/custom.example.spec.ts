import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CustomDividerComponent,
  DividerCustomExampleComponent,
} from './custom.example';

describe('docs-examples-angular: DividerCustomExampleComponent', () => {
  let fixture: ComponentFixture<DividerCustomExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividerCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DividerCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom divider instead of the standard one', () => {
    const custom = fixture.nativeElement.querySelector('.docs-divider');
    const standard = fixture.nativeElement.querySelector(
      'smart-divider-standard',
    );

    expect(custom).toBeTruthy();
    expect(standard).toBeNull();
  });

  it('should render the title and the action label', () => {
    const separator = fixture.nativeElement.querySelector('[role="separator"]');
    const button = fixture.nativeElement.querySelector('button');

    expect(separator.textContent).toContain('Team members');
    expect(button.textContent).toContain('Add member');
  });

  it('should emit actionClick from the custom component when the button is clicked', () => {
    const custom = fixture.debugElement.query(
      By.directive(CustomDividerComponent),
    ).componentInstance as CustomDividerComponent;
    const handler = jest.fn();
    custom.actionClick.subscribe(handler);

    fixture.nativeElement.querySelector('button').click();

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
