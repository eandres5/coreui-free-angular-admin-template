export class UsuarioProveedor {
    usuarioId?: number;
    idUsuario?: number;
    nombres: string;
    apellidos: string;
    direccion: string;
    identificacion: string;
    telefono: string;
    password: string;
    idRol: string;
    nombreRol: string;
    mail: string;

    constructor(usuarioId?: number, nombres: string = '', apellidos: string = '', identificacion: string = '',
        direccion: string = '', telefono: string = '', password: string = '', idRol: string = '', nombreRol: string = '',
                mail: string = ''){
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.identificacion = identificacion;
        this.direccion = direccion;
        this.telefono = telefono;
        this.password = password;
        this.idRol = idRol;
        this.usuarioId = usuarioId;
        this.nombreRol = nombreRol;
        this.mail = mail;
    }
}
