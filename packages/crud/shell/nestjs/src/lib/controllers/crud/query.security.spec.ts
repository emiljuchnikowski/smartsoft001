import { CrudController } from './crud.controller';

describe('crud-nestjs: query and export security', () => {
  const controller = new CrudController<{
    id: string;
    name: string;
    amount: number;
  }>({} as any);
  const query = (value: Record<string, unknown>) =>
    controller['getQueryObject'](value);

  it('bounds default and excessive result limits', () => {
    expect(query({}).options.limit).toBe(100);
    expect(query({ limit: '100000' }).options.limit).toBe(100);
  });
  it.each([
    { $where: 'return true' },
    { name: '/(a+)+$/' },
    { 'name:regex': '.*' },
    { limit: '-1' },
    { limit: 'NaN' },
    { offset: '-1' },
    { 'constructor.x': 'x' },
    { fields: '$where' },
    { $search: '(a+)+' },
  ])('rejects unsafe queries: %j', (value) => {
    expect(() => query(value)).toThrow();
  });
  it('preserves delimiters in values instead of creating extra query parameters', () => {
    const result = query({ name: 'Alice&$where=return true' });
    expect(result.criteria).toEqual({ name: 'Alice&$where=return true' });
  });
  it('keeps normal comparisons, ordering and pagination', () => {
    const result = query({
      'price>': '10',
      sort: '-price',
      limit: '5',
      offset: '10',
    });
    expect(result.criteria).toEqual({ price: { $gte: 10 } });
    expect(result.options).toMatchObject({
      sort: { price: -1 },
      limit: 5,
      skip: 10,
    });
  });
  it.each([
    '=1+1',
    '+SUM(A1)',
    '-1+1',
    '@SUM(A1)',
    '  =1+1',
    '\tvalue',
    '\rvalue',
  ])('exports dangerous text as text: %s', (name) => {
    const csv = controller['parseToCsv']([{ id: 'test', name, amount: -12 }]);
    expect(csv).toContain('"\'' + name + '"');
    expect(csv).toContain('-12');
  });
});
