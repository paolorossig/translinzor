'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/tracker?code=${trackingNumber}`)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="tracking-number">Número de seguimiento</Label>
        <Input
          id="tracking-number"
          type="text"
          placeholder="Ingrese su número de seguimiento"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">
        Rastrear envio
      </Button>
    </form>
  )
}
