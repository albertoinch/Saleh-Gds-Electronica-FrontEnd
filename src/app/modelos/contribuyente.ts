export class Contribuyente {
    constructor(
        public id_contribuyente: Number,
        public nombre: string,
        public nit: String,
        public codigo_ambiente: Number,
        public codigo_modalidad: Number,
        public estado: String
    ) {}
}