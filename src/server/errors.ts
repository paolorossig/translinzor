export class KnownError extends Error {
  constructor(message: keyof typeof ServerErrorType) {
    super(ServerErrorType[message])
    this.name = message
  }
}

export enum ServerErrorType {
  UNAUTHORIZED = 'No autorizado',
  INSUFFICIENT_PRIVILEGES = 'Privilegios insuficientes',
  CREATE_SHIPMENT_ERROR = 'Error al crear el envío',
  SHIPMENT_NOT_FOUND = 'El envío no existe',
  SHIPMENT_ALREADY_STARTED = 'El envío ya ha sido iniciado',
  ORDER_NOT_FOUND = 'La orden no existe',
  ORDER_ALREADY_FINISHED = 'La orden ya ha sido finalizada',
  COSTUMER_ALREADY_EXISTS = 'El cliente ya existe en la base de datos',
}
