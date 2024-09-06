import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricCardProps {
  title: string
  value: number
  detail: string
  icon: React.ComponentType<{ className?: string }>
}

export function MetricCard({
  title,
  value,
  detail,
  icon: CardIcon,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardIcon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          {new Intl.NumberFormat().format(value)}
        </div>
        <p className="text-xs text-gray-500">{detail}</p>
      </CardContent>
    </Card>
  )
}
