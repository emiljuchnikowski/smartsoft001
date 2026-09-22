import * as querystring from 'querystring';
const iso8601 =
  /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12][0-9]|3[01]))?)?(T([01][0-9]|2[0-3]):[0-5]\d(:[0-5]\d(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$/;

/** Names of the query parameters that carry paging and projection. */
export interface IQ2mKeywords {
  fields?: string;
  omit?: string;
  sort?: string;
  offset?: string;
  limit?: string;
}

/** Parses a query string into an object and back, the way `querystring` does. */
export interface IQ2mParser {
  parse(query: string): Record<string, unknown>;
  stringify(query: Record<string, unknown>): string;
}

export interface IQ2mOptions {
  keywords?: IQ2mKeywords;
  /** Query keys that are not turned into criteria. */
  ignore?: string | string[];
  maxLimit?: number;
  parser?: IQ2mParser;
}

/** Mongo query options derived from the paging and projection parameters. */
export interface IQ2mMongoOptions {
  fields?: Record<string, 0 | 1>;
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
}

export interface IQ2mResult {
  criteria: Record<string, unknown>;
  options: IQ2mMongoOptions;
  /** Paging links, or `null` when the query has no limit. */
  links(url: string, totalCount: number): Record<string, string> | null;
}

interface IResolvedOptions {
  keywords: Required<IQ2mKeywords>;
  ignore: string[];
  maxLimit?: number;
  parser: IQ2mParser;
}

const defaultParser: IQ2mParser = {
  parse: (query) => querystring.parse(query),
  // What gets stringified is what `parse` produced plus the numeric offsets
  // written by `links`, which is exactly what `querystring` accepts.
  stringify: (query) =>
    querystring.stringify(query as querystring.ParsedUrlQueryInput),
};

// Convert comma separated list to a mongo projection.
// for example f('field1,field2,field3') -> {field1:true,field2:true,field3:true}
function fieldsToMongo(fields: unknown): Record<string, 1> | null {
  // Anything but a non-empty string (a repeated parameter arrives as an array)
  // is not a projection.
  if (typeof fields !== 'string' || !fields) return null;
  const hash: Record<string, 1> = {};
  fields.split(',').forEach(function (field) {
    hash[field.trim()] = 1;
  });
  return hash;
}

function convertRegex(val: string): string {
  return val.toString().replace(/\*/g, '[*]');
}

// Convert comma separated list to a mongo projection which specifies fields to omit.
// for example f('field2') -> {field2:false}
function omitFieldsToMongo(omitFields: unknown): Record<string, 0> | null {
  if (typeof omitFields !== 'string' || !omitFields) return null;
  const hash: Record<string, 0> = {};
  omitFields.split(',').forEach(function (omitField) {
    hash[omitField.trim()] = 0;
  });
  return hash;
}

// Convert comma separated list to mongo sort options.
// for example f('field1,+field2,-field3') -> {field1:1,field2:1,field3:-1}
function sortToMongo(sort: unknown): Record<string, 1 | -1> | null {
  if (typeof sort !== 'string' || !sort) return null;
  const hash: Record<string, 1 | -1> = {};
  let c: string;
  sort.split(',').forEach(function (field) {
    c = field.charAt(0);
    if (c === '-') field = field.substr(1);
    hash[field.trim()] = c === '-' ? -1 : 1;
  });
  return hash;
}

// Convert String to Number, Date, or Boolean if possible. Also strips ! prefix
function typedValue(value: string): unknown {
  if (value[0] === '!') value = value.substr(1);
  const regex = value.match(/^\/(.*)\/(i?)$/);
  const quotedString = value.match(/(["'])(?:\\\1|.)*?\1/);

  if (regex) {
    return new RegExp(regex[1], regex[2]);
  } else if (quotedString) {
    return quotedString[0].substr(1, quotedString[0].length - 2);
  } else if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else if (iso8601.test(value) && value.length !== 4 && value.length !== 10) {
    return new Date(value);
  } else if (!isNaN(Number(value))) {
    return Number(value);
  }

  return value;
}

// Convert a comma separated string value to an array of values.  Commas
// in a quoted strings and regexes are ignored.  Also strips ! prefix from values.
function typedValues(svalue: string): unknown[] {
  const commaSplit = /("[^"]*")|('[^']*')|(\/[^/]*\/i?)|([^,]+)/g;
  // A value made of commas only (`?a=,`) has no separable parts; it is one
  // literal value rather than a crash.
  const parts = svalue.match(commaSplit) ?? [svalue];
  return parts.map((value) => typedValue(value));
}

// Convert a key/value pair split at an equals sign into a mongo comparison.
// Converts value Strings to Numbers or Booleans when possible.
// for example:
// + f('key','value') => {key:'key',value:'value'}
// + f('key>','value') => {key:'key',value:{$gte:'value'}}
// + f('key') => {key:'key',value:{$exists: true}}
// + f('!key') => {key:'key',value:{$exists: false}}
// + f('key:op','value') => {key: 'key', value:{ $op: value}}
// + f('key','op:value') => {key: 'key', value:{ $op: value}}
function comparisonToMongo(
  key: string,
  value: unknown,
): { key: string; value: unknown } | null {
  const join = value === '' ? key : key.concat('=', String(value));
  const parts = join.match(/^(!?[^><~!=:]+)(?:=?([><]=?|~?=|!?=|:.+=)(.+))?$/);
  let op: string;
  let result: unknown;
  if (!parts) return null;

  key = parts[1];
  op = parts[2];

  if (!op) {
    if (key[0] !== '!') result = { $exists: true };
    else {
      key = key.substr(1);
      result = { $exists: false };
    }
  } else if (op === '=' && parts[3] === '!') {
    result = { $exists: false };
  } else if (op === '=' || op === '!=') {
    if (op === '=' && parts[3][0] === '!') op = '!=';
    // tslint:disable-next-line:no-shadowed-variable
    const array = typedValues(parts[3]);
    const first = array[0];
    if (array.length > 1) {
      op = op === '=' ? '$in' : '$nin';
      result = { [op]: array };
    } else if (op === '!=') {
      result = first instanceof RegExp ? { $not: first } : { $ne: first };
    } else if (typeof first === 'string' && first[0] === '!') {
      const sValue = first.substr(1);
      const regex = sValue.match(/^\/(.*)\/(i?)$/);
      result = regex
        ? { $not: new RegExp(regex[1], regex[2]) }
        : { $ne: sValue };
    } else {
      result = first;
    }
  } else if (op[0] === ':' && op[op.length - 1] === '=') {
    op = '$' + op.substr(1, op.length - 2);
    const array = parts[3].split(',').map((item) => typedValue(item));
    result = { [op]: array.length === 1 ? array[0] : array };
  } else {
    const typed = typedValue(parts[3]);
    result = typed;
    if (op === '>') result = { $gt: typed };
    else if (op === '>=') result = { $gte: typed };
    else if (op === '<') result = { $lt: typed };
    else if (op === '<=') result = { $lte: typed };
    else if (op === '~=')
      result = {
        $regex: typed ? convertRegex(String(typed)) : '',
        $options: 'i',
      };
  }

  return { key, value: result };
}

// Checks for keys that are ordinal positions, such as {'0':'one','1':'two','2':'three'}
function hasOrdinalKeys(obj: object): boolean {
  let c = 0;
  for (const key in obj) {
    if (Number(key) !== c++) return false;
  }
  return true;
}

// Convert query parameters to a mongo query criteria.
// for example {field1:"red","field2>2":""} becomes {field1:"red",field2:{$gt:2}}
function queryCriteriaToMongo(
  query: Record<string, unknown>,
  ignore: string[] = [],
): Record<string, unknown> {
  const hash: Record<string, unknown> = {};

  for (const key in query) {
    if (
      Object.prototype.hasOwnProperty.call(query, key) &&
      ignore.indexOf(key) === -1
    ) {
      const value = query[key];
      // `null` is not an object to descend into: it compares as the literal
      // string "null", exactly as a string value would.
      const deep =
        typeof value === 'object' && value !== null && !hasOrdinalKeys(value);

      const p = deep
        ? {
            key: key,
            value: queryCriteriaToMongo(value as Record<string, unknown>),
          }
        : comparisonToMongo(key, value);

      if (p) {
        const existing = hash[p.key];
        if (!existing) {
          hash[p.key] = p.value;
        } else if (typeof p.value === 'string') {
          hash[p.key] = Object.assign(existing, {
            $eq: p.value,
          });
        } else {
          hash[p.key] = Object.assign(existing, p.value);
        }
      }
    }
  }
  return hash;
}

// Convert query parameters to a mongo query options.
// for example {fields:'a,b',offset:8,limit:16} becomes {fields:{a:true,b:true},skip:8,limit:16}
function queryOptionsToMongo(
  query: Record<string, unknown>,
  options: IResolvedOptions,
): IQ2mMongoOptions {
  const hash: IQ2mMongoOptions = {},
    fields = fieldsToMongo(query[options.keywords.fields]),
    omitFields = omitFieldsToMongo(query[options.keywords.omit]),
    sort = sortToMongo(query[options.keywords.sort]),
    maxLimit = options.maxLimit || 9007199254740992;

  let limit = options.maxLimit || 0;

  if (fields) hash.fields = fields;
  // omit intentionally overwrites fields if both have been specified in the query
  // mongo does not accept mixed true/fals field specifiers for projections
  if (omitFields) hash.fields = omitFields;
  if (sort) hash.sort = sort;

  if (query[options.keywords.offset])
    hash.skip = Number(query[options.keywords.offset]);
  if (query[options.keywords.limit])
    limit = Math.min(Number(query[options.keywords.limit]), maxLimit);
  if (limit) {
    hash.limit = limit;
  } else if (options.maxLimit) {
    hash.limit = maxLimit;
  }

  return hash;
}

function resolveOptions(options: IQ2mOptions | null): IResolvedOptions {
  const given = options || {};

  const keywords: Required<IQ2mKeywords> = Object.assign(
    {
      fields: 'fields',
      omit: 'omit',
      sort: 'sort',
      offset: 'offset',
      limit: 'limit',
    },
    given.keywords || {},
  );
  const ignoreKeywords = [
    keywords.fields,
    keywords.omit,
    keywords.sort,
    keywords.offset,
    keywords.limit,
  ];

  let ignore: string[];
  if (!given.ignore) {
    ignore = [];
  } else {
    ignore = typeof given.ignore === 'string' ? [given.ignore] : given.ignore;
  }

  return {
    keywords,
    ignore: ignore.concat(ignoreKeywords),
    maxLimit: given.maxLimit,
    parser: given.parser || defaultParser,
  };
}

export function q2m(
  query: string | Record<string, unknown> | null = null,
  options: IQ2mOptions | null = null,
): IQ2mResult {
  const resolved = resolveOptions(options);
  const parsed: Record<string, unknown> =
    typeof query === 'string' ? resolved.parser.parse(query) : query || {};

  return {
    criteria: queryCriteriaToMongo(parsed, resolved.ignore),
    options: queryOptionsToMongo(parsed, resolved),

    links: function (this: { options: IQ2mMongoOptions }, url, totalCount) {
      const offset = this.options.skip || 0;
      const limit = Math.min(this.options.limit || 0, totalCount);
      const links: Record<string, string> = {};

      if (!limit) return null;

      const offsetKey = resolved.keywords.offset;

      if (offset > 0) {
        parsed[offsetKey] = Math.max(offset - limit, 0);
        links['prev'] = url + '?' + resolved.parser.stringify(parsed);
        parsed[offsetKey] = 0;
        links['first'] = url + '?' + resolved.parser.stringify(parsed);
      }
      if (offset + limit < totalCount) {
        const pages = Math.ceil(totalCount / limit);
        const lastOffset = (pages - 1) * limit;

        parsed[offsetKey] = Math.min(offset + limit, lastOffset);
        links['next'] = url + '?' + resolved.parser.stringify(parsed);
        parsed[offsetKey] = lastOffset;
        links['last'] = url + '?' + resolved.parser.stringify(parsed);
      }
      return links;
    },
  };
}
