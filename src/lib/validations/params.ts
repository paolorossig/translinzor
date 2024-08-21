import {
  createSearchParamsCache,
  parseAsIsoDateTime,
  parseAsStringLiteral,
} from 'nuqs/server'

import { getPastMonday, getToday } from '@/lib/utils'

export const searchParamsParser = {
  date: parseAsIsoDateTime.withDefault(getToday()),
  from: parseAsIsoDateTime.withDefault(getPastMonday(getToday())),
  to: parseAsIsoDateTime.withDefault(getToday()),
  aggregator: parseAsStringLiteral([
    'route',
    'deliveryDate',
  ] as const).withDefault('route'),
}

export const searchParamsCache = createSearchParamsCache(searchParamsParser)
