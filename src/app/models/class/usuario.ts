export class Usuario {
    idUsuario?: number;
    nombres: string;
    apellidos: string;
    direccion: string;
    identificacion: string;
    telefono: string;
    activo: string;
    createdAt?: Date;
    password: string;
    idRol?: string; 

    constructor(idUsuario?: number, nombres: string = '', apellidos: string = '', identificacion: string = '', 
        direccion: string = '', telefono: string = '', activo: string = '', password: string = '', idRol: string = '' ){
        this.idUsuario = idUsuario;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.identificacion = identificacion;
        this.direccion = direccion;
        this.telefono = telefono;
        this.activo = activo;
        this.password = password;
        this.idRol = idRol;
    }
}