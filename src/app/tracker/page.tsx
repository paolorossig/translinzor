import Header from '@/components/layout/header'
import StatusCard from '@/components/modules/tracker/status-card'
import TrackingForm from '@/components/modules/tracker/tracking-form'

interface TrackerPageProps {
  searchParams: {
    code?: string
  }
}

export default function TrackerPage({ searchParams }: TrackerPageProps) {
  const { code } = searchParams
  return (
    <div>
      <Header />
      <div className="mx-auto w-full max-w-md px-4 py-12 md:px-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">
              Rastrea tu envío
            </h1>
            <p className="text-muted-foreground">
              Ingrese su número de seguimiento para ver el estado de su entrega.
            </p>
          </div>
          <TrackingForm />
          {code && <StatusCard code={code} />}
        </div>
      </div>
    </div>
  )
}
