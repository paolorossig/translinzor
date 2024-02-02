import { Loader2Icon } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div role="status">
        <Loader2Icon className="mr-2 h-6 w-6 animate-spin" />
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  )
}
