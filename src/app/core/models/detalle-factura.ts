// RUTA: src/app/panel-control/modelos/detalle-factura.ts

export interface DetalleFactura {
  id: number;
  descripcionServicio: string;
  cantidad: number;
  precioUnitario: number;
}