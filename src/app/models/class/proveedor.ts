export class Proveedor {
    proveedorId?: number;
    nombre: string;
    identificacion: string;
    direccion: string;
    telefono?: string;
    activo: string;
    createdAt?: Date;
    productos? : [];
    updateAt?: Date;

    constructor(proveedorId?: number, nombre: string = '', identificacion: string = '',
        direccion: string = '', telefono: string = '', activo: string = '') {
    this.proveedorId = proveedorId;
      this.nombre = nombre;
      this.identificacion = identificacion;
      this.direccion = direccion;
      this.telefono = telefono;
      this.activo = activo;
    }
  }
