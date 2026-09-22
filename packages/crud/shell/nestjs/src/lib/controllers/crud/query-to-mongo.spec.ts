import * as queryToMongo from './query-to-mongo';

describe('crud-nestjs: query-to-mongo', () => {
  describe('q2m', () => {
    it('should convert query string to mongo object', () => {
      const result = queryToMongo.q2m('a=1&b=2');
      expect(result).toHaveProperty('criteria');
    });
    it('should convert query object to mongo object', () => {
      const result = queryToMongo.q2m({ a: '1', b: '2' });
      expect(result).toHaveProperty('criteria');
    });
    it('should provide links function', () => {
      const result = queryToMongo.q2m({ a: '1', limit: '2', offset: '0' });
      expect(typeof result.links).toBe('function');
    });
    it('links should return null if no limit', () => {
      const result = queryToMongo.q2m({ a: '1' });
      expect(result.links('url', 10)).toBeNull();
    });
    it('links should return prev and first if offset > 0', () => {
      const result = queryToMongo.q2m({ a: '1', limit: '2', offset: '2' });
      const links = result.links('url', 10);
      expect(links).toHaveProperty('prev');
    });
    it('links should return next and last if more pages', () => {
      const result = queryToMongo.q2m({ a: '1', limit: '2', offset: '0' });
      const links = result.links('url', 10);
      expect(links).toHaveProperty('next');
    });
    it('should treat a value made of commas only as one literal value', () => {
      // `?a=,` has no separable parts, which used to crash the parser.
      const result = queryToMongo.q2m('a=,');
      expect(result.criteria).toEqual({ a: ',' });
    });
  });
});
