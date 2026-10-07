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
    { name: ':regex=(a+)+$' },
    { 'name~': ['a', 'b'], limit: ['1', '2'] },
    { limit: '-1' },
    { limit: 'NaN' },
    { offset: '-1' },
    { 'constructor.x': 'x' },
    { fields: '$where' },
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

describe('crud-nestjs: queries sent by the Angular CRUD UI', () => {
  const controller = new CrudController<{ id: string }>({} as any);
  const query = (value: Record<string, unknown>) =>
    controller['getQueryObject'](value);

  it('accepts the ~= text filter and matches the value literally', () => {
    const result = query({ 'name~': 'john.doe (a+)+' });

    expect(result.criteria).toEqual({
      name: { $regex: 'john\\.doe \\(a\\+\\)\\+', $options: 'i' },
    });
  });

  it('unquotes a numeric-looking ~= value the way the UI sends it', () => {
    const result = query({ 'code~': "'123'" });

    expect(result.criteria).toEqual({
      code: { $regex: '123', $options: 'i' },
    });
  });

  it('rejects a ~= value longer than 256 characters', () => {
    expect(() => query({ 'name~': 'a'.repeat(257) })).toThrow();
  });

  it('turns a repeated key from the check filter into $in', () => {
    const result = query({ status: ['new', 'done'] });

    expect(result.criteria).toEqual({ status: { $in: ['new', 'done'] } });
  });

  it('rejects a repeated key with more than 100 values', () => {
    const values = Array.from({ length: 101 }, (_, i) => 'v' + i);

    expect(() => query({ status: values })).toThrow();
  });

  it.each(['john.doe', 'what?', '(a+)+'])(
    'accepts $search with punctuation: %s',
    (text) => {
      const result = query({ $search: text });

      expect(result.criteria).toEqual({ $search: text });
    },
  );

  it('rejects a $search longer than 256 characters', () => {
    expect(() => query({ $search: 'a'.repeat(257) })).toThrow();
  });
});

describe('crud-nestjs: configurable limits, exports and links', () => {
  type Row = { id: string; name: string };
  const rows = (count: number, from = 0): Row[] =>
    Array.from({ length: count }, (_, i) => ({
      id: String(from + i),
      name: 'row' + (from + i),
    }));

  function setup(config: Record<string, unknown> = {}) {
    const service = { read: jest.fn() };
    const controller = new CrudController<Row>(service as any, config as any);
    const res = { set: jest.fn(), send: jest.fn() };
    const request = (q: Record<string, unknown>, contentType?: string) =>
      ({
        query: q,
        protocol: 'http',
        url: '/items',
        headers: {
          host: 'localhost',
          ...(contentType ? { 'content-type': contentType } : {}),
        },
      }) as any;

    return { service, controller, res, request };
  }

  it('caps the list limit at the configured maxQueryLimit', () => {
    const { controller } = setup({ maxQueryLimit: 500 });

    const result = controller['getQueryObject']({ limit: '1000' });

    expect(result.options.limit).toBe(500);
  });

  it('exports more than 100 rows as CSV without truncating them', async () => {
    const { service, controller, res, request } = setup();
    service.read.mockResolvedValue({ data: rows(150), totalCount: 150 });

    await controller.read({} as any, request({}, 'text/csv'), res as any);

    expect(service.read.mock.calls[0][1].limit).toBe(10000);
    const csv: string = res.send.mock.calls[0][0];
    expect(csv.split('\n')).toHaveLength(151);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  it('uses the configured maxExportLimit for exports', async () => {
    const { service, controller, res, request } = setup({
      maxExportLimit: 20000,
    });
    service.read.mockResolvedValue({ data: rows(1), totalCount: 1 });

    await controller.read({} as any, request({}, 'text/csv'), res as any);

    expect(service.read.mock.calls[0][1].limit).toBe(20000);
  });

  it('refuses an export that would be truncated by maxExportLimit', async () => {
    const { service, controller, res, request } = setup({ maxExportLimit: 2 });
    service.read.mockResolvedValue({ data: rows(2), totalCount: 3 });

    await expect(
      controller.read({} as any, request({}, 'text/csv'), res as any),
    ).rejects.toThrow(/maxExportLimit/);
    expect(res.send).not.toHaveBeenCalled();
  });

  it('exports an explicit page and reports the total in X-Total-Count', async () => {
    const { service, controller, res, request } = setup();
    service.read.mockResolvedValue({ data: rows(10), totalCount: 30 });

    await controller.read(
      {} as any,
      request({ limit: '10' }, 'text/csv'),
      res as any,
    );

    expect(res.set).toHaveBeenCalledWith(
      expect.objectContaining({ 'X-Total-Count': '30' }),
    );
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  it('omits next and last links whose offset is beyond the offset cap', async () => {
    const { service, controller, res, request } = setup();
    service.read.mockResolvedValue({ data: rows(100), totalCount: 50000 });

    await controller.read(
      {} as any,
      request({ limit: '100', offset: '9950' }),
      res as any,
    );

    const { links } = res.send.mock.calls[0][0];
    expect(Object.keys(links).sort()).toEqual(['first', 'prev']);
  });

  it('keeps a next link that can still be followed at the offset cap', async () => {
    const { service, controller, res, request } = setup();
    service.read.mockResolvedValue({ data: rows(100), totalCount: 50000 });

    await controller.read(
      {} as any,
      request({ limit: '100', offset: '9900' }),
      res as any,
    );

    const { links } = res.send.mock.calls[0][0];
    expect(links.next).toContain('offset=10000');
    expect(links.last).toBeUndefined();
  });
});
