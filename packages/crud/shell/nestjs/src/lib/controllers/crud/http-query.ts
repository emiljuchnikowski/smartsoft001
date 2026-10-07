import { BadRequestException } from '@nestjs/common';

import { IQ2mResult, q2m } from './query-to-mongo';
import { MAX_QUERY_OFFSET } from '../../crud-query.config';

const operators = new Set([
  '$eq',
  '$ne',
  '$gt',
  '$gte',
  '$lt',
  '$lte',
  '$in',
  '$nin',
  '$exists',
  // Only produced by the `~=` filter, whose value q2m escapes to a literal.
  '$regex',
  '$options',
]);
const reservedKeys = new Set([
  '$search',
  'fields',
  'omit',
  'sort',
  'limit',
  'offset',
]);
const MAX_KEY_LENGTH = 128;
const MAX_VALUE_LENGTH = 1024;
/** `~=` filters and `$search` scan every document, so their text is shorter. */
const MAX_TEXT_SEARCH_LENGTH = 256;
/** A repeated key (the `check` filter) becomes `$in`; this bounds its values. */
const MAX_VALUES_PER_KEY = 100;
const MAX_QUERY_LENGTH = 4096;

export interface IHttpQueryLimits {
  maxLimit: number;
}

function field(name: string): boolean {
  return (
    /^[A-Za-z_][\w]*(\.[A-Za-z_][\w]*)*$/.test(name) &&
    !name
      .split('.')
      .some((part) => ['__proto__', 'prototype', 'constructor'].includes(part))
  );
}
function invalid(): never {
  throw new BadRequestException('Unsupported or unbounded query');
}
function value(input: unknown, depth = 0): void {
  if (depth > 3 || input instanceof RegExp) invalid();
  if (input instanceof Date) return;
  if (Array.isArray(input)) {
    if (input.length > MAX_VALUES_PER_KEY) invalid();
    input.forEach((item) => value(item, depth + 1));
  } else if (input && typeof input === 'object') {
    for (const [key, item] of Object.entries(input)) {
      if (!operators.has(key)) invalid();
      value(item, depth + 1);
    }
  }
}
function scalar(item: unknown): item is string | number | boolean {
  return ['string', 'number', 'boolean'].includes(typeof item);
}
function integer(text: string, min: number, max: number): boolean {
  const number = Number(text);
  return Number.isSafeInteger(number) && number >= min && number <= max;
}

function validateKey(key: string): void {
  if (key.length > MAX_KEY_LENGTH) invalid();
  if (key.includes('$') && key !== '$search') invalid();
  // `field:op=value` is q2m's raw operator syntax; it is not part of the HTTP API.
  if (key.includes(':')) invalid();
  const fieldName = /^!?([^><~!=:]+)/.exec(key)?.[1];
  if (key !== '$search' && (!fieldName || !field(fieldName))) invalid();
}

function validateValue(key: string, text: string): void {
  if (text.length > MAX_VALUE_LENGTH) invalid();
  // q2m reads `key=:op=value` as a raw operator too.
  if (/^:.*=/.test(text)) invalid();
  if (
    (key === '$search' || key.endsWith('~')) &&
    text.length > MAX_TEXT_SEARCH_LENGTH
  )
    invalid();
  if (key === 'limit' && !integer(text, 1, Number.MAX_SAFE_INTEGER)) invalid();
  if (key === 'offset' && !integer(text, 0, MAX_QUERY_OFFSET)) invalid();
}

/** HTTP-only boundary; the lower-level parser remains available to trusted callers. */
export function parseHttpQuery(
  query: Record<string, unknown>,
  limits: IHttpQueryLimits,
): IQ2mResult {
  const params = new URLSearchParams();
  for (const [key, item] of Object.entries(query)) {
    validateKey(key);
    const items = Array.isArray(item) && !reservedKeys.has(key) ? item : [item];
    if (items.length > MAX_VALUES_PER_KEY || !items.every(scalar)) invalid();
    for (const entry of items) {
      const text = String(entry);
      validateValue(key, text);
      params.append(key, text);
    }
  }
  if (params.toString().length > MAX_QUERY_LENGTH) invalid();
  const result = q2m(params.toString(), {
    maxLimit: limits.maxLimit,
    maxOffset: MAX_QUERY_OFFSET,
  });
  for (const [key, item] of Object.entries(result.criteria)) {
    if (key === '$search') {
      if (typeof item !== 'string') invalid();
    } else {
      if (!field(key)) invalid();
      value(item);
    }
  }
  for (const fields of [result.options.fields, result.options.sort]) {
    if (fields && Object.keys(fields).some((key) => !field(key))) invalid();
  }
  return result;
}
