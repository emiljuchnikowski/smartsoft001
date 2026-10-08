import { createTranslator, mergeTranslations } from './translate';

describe('@smartsoft001/react: translate', () => {
  it('should resolve a nested key', () => {
    const t = createTranslator({ MODEL: { name: 'Name' } });

    expect(t('MODEL.name')).toBe('Name');
  });

  it('should resolve a flat key containing dots', () => {
    const t = createTranslator({ 'MODEL.name': 'Flat' });

    expect(t('MODEL.name')).toBe('Flat');
  });

  it('should return the key when there is no translation', () => {
    const t = createTranslator({});

    expect(t('MODEL.unknown')).toBe('MODEL.unknown');
  });

  it('should return the key for a branch that is not a string', () => {
    const t = createTranslator({ MODEL: { name: 'Name' } });

    expect(t('MODEL')).toBe('MODEL');
  });

  it('should interpolate parameters', () => {
    const t = createTranslator({ hello: 'Hello {{ name }}' });

    expect(t('hello', { name: 'Ada' })).toBe('Hello Ada');
  });

  it('should leave an unknown parameter as is', () => {
    const t = createTranslator({ hello: 'Hello {{name}}' });

    expect(t('hello', {})).toBe('Hello {{name}}');
  });

  it('should deep-merge dictionaries with the later one winning', () => {
    const merged = mergeTranslations(
      { MODEL: { name: 'Name', city: 'City' } },
      { MODEL: { name: 'Nazwa' } },
    );

    expect(merged).toEqual({ MODEL: { name: 'Nazwa', city: 'City' } });
  });
});
