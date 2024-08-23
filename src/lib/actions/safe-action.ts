import { createSafeActionClient } from 'next-safe-action'

import { getUser } from '@/lib/auth/server'

const DEFAULT_SERVER_ERROR_MESSAGE = 'Algo salió mal al ejecutar la operación.'

export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof Error) return e.message
    return DEFAULT_SERVER_ERROR_MESSAGE
  },
})

export const authActionClient = actionClient
  .use(async ({ next, clientInput }) => {
    const result = await next()

    if (process.env.NODE_ENV === 'development') {
      console.log('Input ->', clientInput)
      console.log('Result ->', result.data)
    }

    return result
  })
  .use(async ({ next }) => {
    const user = await getUser()
    if (!user) throw new Error('No autorizado')

    return next({ ctx: { user } })
  })
