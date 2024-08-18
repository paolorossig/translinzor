import {
  createSearchParamsCache,
  parseAsIsoDateTime,
  parseAsStringLiteral,
} from 'nuqs/server'

export const searchParamsParser = {
  date: parseAsIsoDateTime,
  from: parseAsIsoDateTime,
  to: parseAsIsoDateTime,
  aggregator: parseAsStringLiteral([
    'route',
    'deliveryDate',
  ] as const).withDefault('route'),
}

export const searchParamsCache = createSearchParamsCache(searchParamsParser)
