const fs = require('fs');

class Contenedor {

    constructor(nombreArchivo) {

        this.fileName = nombreArchivo;
        this.contenido = [];
        this.leerArchivo()

    }

    leerArchivo() {

        try {

            if (fs.existsSync(this.fileName)) {
                const data = fs.readFileSync(this.fileName, 'utf-8');
                this.contenido = JSON.parse(data);
            }

        } catch (error) {
            console.log('Error al leer el archivo', error);
        }
    }

    escribirArchivo(contenido) {

        try {
            fs.writeFileSync(this.fileName, JSON.stringify(contenido))
        } catch (error) {
            console.log('Error al escribir el archivo', error);
        }
    }

    getAll() {
        return this.contenido;
    }

    getById(id) {

        let producto = {}
        producto = this.contenido.find(element => element.id == id);
        if (!producto) {
            producto = null
        }
        return producto
    }

    save(producto) {

        const id = this.contenido.length + 1;
        producto["id"] = id;
        this.contenido.push(producto);
        this.escribirArchivo(this.contenido);

        return `El id del objeto añadido es ${id}`
    }

    deleteById(id) {

        const contenidoNuevo = this.contenido.filter(element => element.id !== id)
        this.escribirArchivo(contenidoNuevo);

    }

    deleteAll() {
        const contentido = [];
        this.contenido = contentido
        this.escribirArchivo(this.contenido);
    }

}

module.exports = Contenedor ;