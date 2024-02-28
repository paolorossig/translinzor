import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

import { searchParamsSchema } from '../validations/params'

export function useQueryString() {
  const rawParams = useSearchParams()
  const searchParams = searchParamsSchema.parse(Object.fromEntries(rawParams))

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(rawParams?.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [rawParams],
  )

  return { searchParams, createQueryString }
}
