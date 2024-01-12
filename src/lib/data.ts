export type Client = {
  id: number
  name: string
  channel: string
  documentType: 'ruc' | 'dni'
  documentNumber: number
  address: string
  district: string
  isActive: boolean
}

export const clients: Client[] = [
  {
    id: 1,
    name: 'LA PILAR DE LOS ACCESORIOS SAC',
    channel: 'VCORP',
    documentType: 'ruc',
    documentNumber: 20600572627,
    address: 'AV. LOS FRUTALES 220 URB. LA CAPILLA - CALLAO',
    district: 'Callao',
    isActive: true,
  },
  {
    id: 2,
    name: 'FERREOBRAS S.A.C.',
    channel: 'VCORP',
    documentType: 'ruc',
    documentNumber: 9999999999,
    address: 'JR. LOS HUANCAS 145 - CHORRILLOS',
    district: 'Chorrillos',
    isActive: false,
  },
  {
    id: 3,
    name: 'CALERO ROMERO ROBINSON',
    channel: 'VDISTRIB',
    documentType: 'dni',
    documentNumber: 123456789,
    address: 'AV. BASIL 1020 - PUEBLO LIBRE',
    district: 'Pueblo Libre',
    isActive: true,
  },
]

export const channelOptions = [
  { label: 'VCORP', value: 'VCORP' },
  { label: 'VDISTRIB', value: 'VDISTRIB' },
]
