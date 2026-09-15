import * as publicApi from './index';

describe('@smartsoft001/angular public API', () => {
  it('should export the standard component injection tokens the skills document', () => {
    // Consumers replace a default implementation through these tokens
    // (`providers: [{ provide: BUTTON_STANDARD_COMPONENT_TOKEN, useValue: ... }]`),
    // so they must be reachable from the package entry point, not only from
    // the internal `shared.inectors` module.
    expect(publicApi.BUTTON_STANDARD_COMPONENT_TOKEN).toBeDefined();
    expect(publicApi.BADGE_STANDARD_COMPONENT_TOKEN).toBeDefined();
    expect(publicApi.LOADER_STANDARD_COMPONENT_TOKEN).toBeDefined();

    const tokens = Object.keys(publicApi).filter((name) =>
      name.endsWith('_STANDARD_COMPONENT_TOKEN'),
    );

    expect(tokens.length).toBeGreaterThanOrEqual(46);
  });
});
