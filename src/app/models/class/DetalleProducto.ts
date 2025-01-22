export class DetalleProducto {
    idComprobante?: string;
    nombreProducto: string;
    descripcion: string;
    cantidad: string;
    precio: string;

    constructor(idComprobante: string = '', nombreProducto: string = '', descripcion: string = '',
        cantidad: string = '', precio: string = ''){
        this.idComprobante = idComprobante;
        this.nombreProducto = nombreProducto;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.precio = precio;
    }
}