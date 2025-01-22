import { DetalleCompra } from "./detalleCompra";

export class Compra {
    idCompra?: string;
    numeroCompra: string;
    tipoComprobante: string;
    fechaCompra: string;
    totalCompra: string;
    iva: string;
    idUsuarioProveedor: string;
    idUsuarioComerciante: string;
    detalleCompras?: DetalleCompra[];

    constructor(idCompra: string = '', numeroCompra: string = '', tipoComprobante: string = '',
        fechaCompra: string = '', totalCompra: string = '', iva: string = '', idUsuarioProveedor: string = '', idUsuarioComerciante: string = ''){
        this.idCompra = idCompra;
        this.numeroCompra = numeroCompra;
        this.tipoComprobante = tipoComprobante;
        this.fechaCompra = fechaCompra;
        this.totalCompra = totalCompra;
        this.iva = "";
        this.idUsuarioProveedor = idUsuarioProveedor;
        this.idUsuarioComerciante = idUsuarioComerciante;
    }
}
