import { startOfDay, startOfWeek } from 'date-fns'
import {
  createSearchParamsCache,
  parseAsIsoDateTime,
  parseAsStringLiteral,
} from 'nuqs/server'

export const searchParamsParser = {
  date: parseAsIsoDateTime.withDefault(startOfDay(new Date())),
  from: parseAsIsoDateTime.withDefault(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  ),
  to: parseAsIsoDateTime.withDefault(startOfDay(new Date())),
  aggregator: parseAsStringLiteral([
    'route',
    'deliveryDate',
  ] as const).withDefault('route'),
}

export const searchParamsCache = createSearchParamsCache(searchParamsParser)
