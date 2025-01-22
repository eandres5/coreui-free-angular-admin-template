export class DetalleCompra {
    idDetalleCompra?: string;
    cantidadInicial: string;
    idProducto?: string;
    idCompra?: string;
    precioUnitario: string;
    nombreProducto? : string;
    descripcion?: string;
    stock?: string;
    precio: string;

    constructor(idDetalleCompra: string = '', cantidadInicial: string = '', idProducto: string = '', idCompra: string = '',
        precioUnitario: string = '', nombreProducto: string = '', descripcion: string = '', stock: string = '', precio: string = ''){
        this.idDetalleCompra = idDetalleCompra;
        this.cantidadInicial = cantidadInicial;
        this.idProducto = idProducto;
        this.idCompra = idCompra;
        this.precioUnitario = precioUnitario;
        this.nombreProducto = nombreProducto;
        this.descripcion = descripcion;
        this.stock = stock;
        this.precio = precio;
    }
}