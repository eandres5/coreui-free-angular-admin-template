export class DetalleComprobante {
    idDetalleComprobante: string;
    precioUnitario: string;
    cantidad: string;
    idProducto: string;
    descripcion?: string;
    nombreProducto?: string;

    constructor(idDetalleComprobante: string = '', precioUnitario: string = '', cantidad: string = '', idProducto: string = '',
        descripcion: string = '', nombreProducto: string = ''
    ){
        this.idDetalleComprobante = idDetalleComprobante;
        this.precioUnitario = precioUnitario;
        this.cantidad = cantidad;
        this.idProducto = idProducto;
        this.descripcion = descripcion;
        this.nombreProducto = nombreProducto;
    }
}