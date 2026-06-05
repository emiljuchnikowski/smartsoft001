import { SmartPageVariant } from '@smartsoft001/angular';

import { CrudFullConfig } from './crud.config';

describe('crud-shell-angular: CrudFullConfig declarative styling surface', () => {
  it('should accept cssClass and variant assignments on a CrudFullConfig instance', () => {
    // Arrange
    const config = new CrudFullConfig<any>();
    const variant: SmartPageVariant = 'standard';

    // Act
    config.cssClass = 'my-tier2-class';
    config.variant = variant;

    // Assert
    expect(config.cssClass).toBe('my-tier2-class');
    expect(config.variant).toBe('standard');
  });
});
