import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { outletInputs } from './outlet-inputs';
import { BADGE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { BadgeComponent } from '../badge/badge.component';
import { BadgeBaseComponent } from '../badge/base/base.component';

@Component({
  selector: 'smart-test-aliased',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
class AliasedComponent {
  text = input('');
  cssClass = input('', { alias: 'class' });
}

@Component({
  selector: 'smart-test-plain',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
class PlainComponent {
  cssClass = input('');
}

@Component({
  selector: 'smart-test-custom-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<span [class]="cssClass()">{{ text() }}</span>',
})
class CustomBadgeComponent extends BadgeBaseComponent {}

describe('shared-angular: outletInputs', () => {
  it('should key an aliased input by its public name', () => {
    // Act
    const inputs = outletInputs(AliasedComponent, {
      text: 'Active',
      cssClass: 'smart:mt-2',
    });

    // Assert
    expect(inputs).toEqual({ text: 'Active', class: 'smart:mt-2' });
  });

  it('should keep the property name of an input declared without an alias', () => {
    // Act
    const inputs = outletInputs(PlainComponent, { cssClass: 'smart:mt-2' });

    // Assert
    expect(inputs).toEqual({ cssClass: 'smart:mt-2' });
  });

  it('should leave out the inputs the component does not declare', () => {
    // Act
    const inputs = outletInputs(PlainComponent, {
      cssClass: '',
      options: { withDot: true },
    });

    // Assert
    expect(inputs).toEqual({ cssClass: '' });
  });

  it('should return the inputs unchanged when no component is registered', () => {
    // Arrange
    const given = { cssClass: 'smart:mt-2' };

    // Act
    const inputs = outletInputs(null, given);

    // Assert
    expect(inputs).toBe(given);
  });

  it('should hand the wrapper class to a custom implementation that keeps the base alias', async () => {
    // Arrange
    @Component({
      selector: 'smart-test-host',
      imports: [BadgeComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '<smart-badge text="Active" class="smart:mt-2" />',
    })
    class HostComponent {}

    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        {
          provide: BADGE_STANDARD_COMPONENT_TOKEN,
          useValue: CustomBadgeComponent,
        },
      ],
    });
    const fixture = TestBed.createComponent(HostComponent);

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    const span: HTMLElement = fixture.nativeElement.querySelector(
      'smart-test-custom-badge span',
    );
    expect(span.textContent).toBe('Active');
    expect(span.className).toBe('smart:mt-2');
  });
});
