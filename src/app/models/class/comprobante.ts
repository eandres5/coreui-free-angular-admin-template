import { DetalleComprobante } from "./detalleComprobante";

export class Comprobante {
    idComprobante: string;
    numeroComprobante: string;
    tipoComprobante: string;
    tipoTransaccion: string;
    fechaEmision: string;
    subtotal: string;
    total: string;
    iva: string;
    idUsuarioCliente: string;
    idUsuarioComerciante: string;
    DetalleComprobantes?: DetalleComprobante[];
    identificacion?: string;
    nombreCliente?: string;
    direccion?: string;
    tipoPago?: string;

    constructor(idComprobante: string = '', numeroComprobante: string = '', tipoComprobante: string = '',
        fechaEmision: string = '', subtotal: string = '', total: string = '', iva: string = '', idUsuarioCliente: string = '',
        idUsuarioComerciante: string = '',tipoTransaccion: string = '', identificacion: string = '', nombreCliente: string = '',
        direccion: string = '', tipoPago = ''){
        this.idComprobante = idComprobante;
        this.numeroComprobante = numeroComprobante;
        this.tipoComprobante = tipoComprobante;
        this.fechaEmision = fechaEmision;
        this.subtotal = '0';
        this.iva = iva;
        this.total = total;
        this.idUsuarioCliente = idUsuarioCliente;
        this.idUsuarioComerciante = idUsuarioComerciante;
        this.tipoTransaccion = tipoTransaccion;
        this.identificacion = identificacion;
        this.nombreCliente = nombreCliente;
        this.direccion = direccion;
        this.tipoPago = tipoPago;
    }
}
