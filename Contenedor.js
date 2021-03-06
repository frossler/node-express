const fs = require('fs');

class Contenedor {

    constructor(nombreArchivo) {

        this.fileName = nombreArchivo;
        this.contenido = [];

    //  obtengo el contenido del archivo al instanciar la clase
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

        //  obtengo ultimo id + 1
        const id = this.contenido.length + 1;
        producto["id"] = id;
        //  actualizo el contenido con el nuevo producto
        this.contenido.push(producto);
        //  Grabo el archivo nuevamente
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


const contenedor = new Contenedor('./products.txt');

// contenedor.save({
//     title: "escuadra",
//     price: 80.20,
//     thumbnail: "escuadra.jpg"
// });

// contenedor.save({
//     title: "regla",
//     price: 141.23,
//     thumbnail: "regla.jpg"
// });

// contenedor.save({
//     title: "compas",
//     price: 11.23,
//     thumbnail: "compas.jpg"
// });

// contenedor.save({
//     title: "transportador",
//     price: 16.23,
//     thumbnail: "transportador.jpg"
// });

// contenedor.save({
//     title: "lapicera",
//     price: 1.23,
//     thumbnail: "lapicera.jpg"
// });

console.log('Todos los productos',contenedor.getAll());