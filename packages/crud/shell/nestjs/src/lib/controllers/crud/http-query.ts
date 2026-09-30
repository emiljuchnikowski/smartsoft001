import { BadRequestException } from '@nestjs/common';

import { IQ2mResult, q2m } from './query-to-mongo';

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
]);
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
    if (input.length > 100) invalid();
    input.forEach((item) => value(item, depth + 1));
  } else if (input && typeof input === 'object') {
    for (const [key, item] of Object.entries(input)) {
      if (!operators.has(key)) invalid();
      value(item, depth + 1);
    }
  }
}

/** HTTP-only boundary; the lower-level parser remains available to trusted callers. */
export function parseHttpQuery(query: Record<string, unknown>): IQ2mResult {
  const params = new URLSearchParams();
  for (const [key, item] of Object.entries(query)) {
    if (
      key.length > 128 ||
      !['string', 'number', 'boolean'].includes(typeof item)
    )
      invalid();
    if (key.includes('$') && key !== '$search') invalid();
    const fieldName = /^!?([^><~!=:]+)/.exec(key)?.[1];
    if (key !== '$search' && (!fieldName || !field(fieldName))) invalid();
    const text = String(item);
    if (text.length > 1024) invalid();
    if (key === '$search' && /[.*+?^${}()|[\]\\]/.test(text)) invalid();
    if (
      key === 'limit' &&
      (!Number.isSafeInteger(Number(text)) || Number(text) < 1)
    )
      invalid();
    if (
      key === 'offset' &&
      (!Number.isSafeInteger(Number(text)) ||
        Number(text) < 0 ||
        Number(text) > 10000)
    )
      invalid();
    params.append(key, text);
  }
  if (params.toString().length > 4096) invalid();
  const result = q2m(params.toString(), { maxLimit: 100 });
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
