export interface Costumer {
  id: number
  name: string
  channel: string
  documentType: 'ruc' | 'dni'
  documentNumber: number
  address: string
  district: string
  status: 'active' | 'inactive'
}

export const costumers: Costumer[] = [
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
  {
    id: 4,
    name: 'CERAMICA LIMA S.A.',
    channel: 'VDISTRIB',
    documentType: 'ruc',
    documentNumber: 9999999999,
    address: 'JR. LOS HUANCAS 145 - CHORRILLOS',
    district: 'Chorrillos',
    status: 'active',
  },
]

export const channelOptions = [
  { label: 'VCORP', value: 'VCORP' },
  { label: 'VDISTRIB', value: 'VDISTRIB' },
]

export interface Order {
  orderId: string
  clientId: number
  client: Costumer
  date: string
  status: 'pending' | 'delivered' | 'refused'
  refusedReason?: string
  proofOfDelivery?: string
}

export interface Shipment {
  id: number
  clientId: number
  route: string
  date: Date
  orderIds: string[]
  orders: Order[]
  transportUnitId?: number
  driverId?: number
}

export const shipments: Shipment[] = [
  {
    id: 1,
    clientId: 1,
    route: 'Ruta 1',
    date: new Date('2023-12-24 11:51:40'),
    orderIds: [
      '0090061269',
      '0110006087',
      '0110006088',
      '0110006089',
      '123124533',
    ],
    orders: [
      {
        orderId: '0090061269',
        clientId: costumers[3]!.id,
        client: costumers[3]!,
        date: '2021-02-18 11:51:40',
        status: 'delivered',
      },
      {
        orderId: '0110006087',
        clientId: costumers[0]!.id,
        client: costumers[0]!,
        date: '2021-02-18 11:51:40',
        status: 'delivered',
      },
      {
        orderId: '0110006088',
        clientId: costumers[0]!.id,
        client: costumers[0]!,
        date: '2021-02-18 11:51:40',
        status: 'delivered',
      },
      {
        orderId: '0110006089',
        clientId: costumers[0]!.id,
        client: costumers[0]!,
        date: '2021-02-18 11:51:40',
        status: 'refused',
      },
      {
        orderId: '123124533',
        clientId: costumers[2]!.id,
        client: costumers[2]!,
        date: '2021-02-18 11:51:40',
        status: 'pending',
      },
    ],
  },
  {
    id: 2,
    clientId: 1,
    route: 'Ruta 2',
    date: new Date('2024-01-14 11:51:40'),
    orderIds: ['000123987'],
    orders: [
      {
        orderId: '000123987',
        clientId: costumers[0]!.id,
        client: costumers[0]!,
        date: '2024-01-13 11:51:40',
        status: 'pending',
      },
    ],
  },
]
