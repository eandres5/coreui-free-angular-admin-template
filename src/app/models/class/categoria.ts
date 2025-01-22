export class Categoria {

    categoriaId?: number;
    nombre: string;
    activo: string;
    createdAt?: Date;

    constructor(categoriaId?: number, nombre: string = '', activo: string = ''){
        this.categoriaId = categoriaId;
        this.nombre = nombre;
        this.activo = activo;
    }
}