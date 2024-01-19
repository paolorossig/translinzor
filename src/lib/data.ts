export interface Client {
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

export const statusOptions = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
]

export interface TransportUnit {
  id: number
  licensePlate: string
  type: string
  brand: string
  model: string
  capacity: string
  grossWeight: number
  netWeight: number
}

export const transportUnits: TransportUnit[] = [
  {
    id: 1,
    licensePlate: 'ABC-123',
    type: 'CAMION FURGON',
    brand: 'HYUNDAI',
    model: 'H100 TRUCK',
    capacity: '2 TN',
    grossWeight: 7500,
    netWeight: 3000,
  },
  {
    id: 2,
    licensePlate: 'XYZ-987',
    type: 'AUTO',
    brand: 'DAEWOO',
    model: 'DAMAS II',
    capacity: '2 TN',
    grossWeight: 1280,
    netWeight: 860,
  },
]

export interface Driver {
  id: number
  name: string
  lastName: string
  dni: string
  licenseNumber: string
}

export const drivers: Driver[] = [
  {
    id: 1,
    name: 'Jhon Jairo',
    lastName: 'Doe Smith',
    dni: '45515398',
    licenseNumber: 'Q45515398',
  },
  {
    id: 2,
    name: 'Juan Carlos',
    lastName: 'Condori Quispe',
    dni: '41430373',
    licenseNumber: 'Q41430373',
  },
]

export interface Order {
  orderId: string
  clientId: number
  client: Client
  date: string
  status: 'pending' | 'delivered' | 'refused'
  refusedReason?: string
  proofOfDelivery?: string
}

export interface Shipment {
  id: number
  route: string
  date: Date
  orderIds: string[]
  orders: Order[]
  transportUnitId?: number
  transportUnit?: TransportUnit
  driverId?: number
  driver?: Driver
}

export const shipments: Shipment[] = [
  {
    id: 1,
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
        clientId: clients[3]!.id,
        client: clients[3]!,
        date: '2021-02-18 11:51:40',
        status: 'delivered',
      },
      {
        orderId: '0110006087',
        clientId: clients[0]!.id,
        client: clients[0]!,
        date: '2021-02-18 11:51:40',
        status: 'delivered',
      },
      {
        orderId: '0110006088',
        clientId: clients[0]!.id,
        client: clients[0]!,
        date: '2021-02-18 11:51:40',
        status: 'delivered',
      },
      {
        orderId: '0110006089',
        clientId: clients[0]!.id,
        client: clients[0]!,
        date: '2021-02-18 11:51:40',
        status: 'refused',
      },
      {
        orderId: '123124533',
        clientId: clients[2]!.id,
        client: clients[2]!,
        date: '2021-02-18 11:51:40',
        status: 'pending',
      },
    ],
    transportUnitId: 1,
    transportUnit: transportUnits[0],
  },
  {
    id: 2,
    route: 'Ruta 2',
    date: new Date('2024-01-14 11:51:40'),
    orderIds: ['000123987'],
    orders: [
      {
        orderId: '000123987',
        clientId: clients[0]!.id,
        client: clients[0]!,
        date: '2024-01-13 11:51:40',
        status: 'pending',
      },
    ],
  },
]
