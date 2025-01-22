import { Proveedor } from "./proveedor";

export class Producto {
    idProducto: number | undefined;
    nombreProducto: string;
    descripcion: string;
    stock: string;
    precio: number;
    updateAt?: Date;
    categoriaId?: number;
    qrCodeImage?: string;
    proveedor?: Proveedor;
    idProveedor?: string;
    nombreCategoria?: string;

    constructor(idProducto?: number, nombreProducto: string = '', descripcion: string = '',
        stock: string = '', precio: number = 0, activo: string = '',categoriaId: number = 0,
        nombreCategoria: string = '', qrCodeImage: string = '') {
        this.idProducto = idProducto;
        this.nombreProducto = nombreProducto;
        this.descripcion = descripcion;
        this.stock = stock;
        this.precio = precio;
        this.categoriaId = categoriaId;
        this.nombreCategoria = nombreCategoria;
        this.qrCodeImage = qrCodeImage
    }
}
