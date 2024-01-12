export type Client = {
  id: number
  name: string
  channel: string
  documentType: 'ruc' | 'dni'
  documentNumber: number
  address: string
  district: string
  status: 'active' | 'inactive'
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
    status: 'active',
  },
  {
    id: 2,
    name: 'FERREOBRAS S.A.C.',
    channel: 'VCORP',
    documentType: 'ruc',
    documentNumber: 9999999999,
    address: 'JR. LOS HUANCAS 145 - CHORRILLOS',
    district: 'Chorrillos',
    status: 'inactive',
  },
  {
    id: 3,
    name: 'CALERO ROMERO ROBINSON',
    channel: 'VDISTRIB',
    documentType: 'dni',
    documentNumber: 123456789,
    address: 'AV. BASIL 1020 - PUEBLO LIBRE',
    district: 'Pueblo Libre',
    status: 'active',
  },
]

export const channelOptions = [
  { label: 'VCORP', value: 'VCORP' },
  { label: 'VDISTRIB', value: 'VDISTRIB' },
]

export const statusOptions = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
]
