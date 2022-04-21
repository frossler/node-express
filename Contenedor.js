const fs = require('fs/promises');
const path = require('path');

class Contenedor {
	constructor(filename) {
		this.filename = filename;
	}

	async createFileIfNoneExist() {
		let file;
		try {
			// Leo si el archivo existe
			file = await fs.readFile(this.filename, 'utf-8');
			// Si existe, lo devuelvo
			return file;
		} catch (error) {
			// Si hay algun error, verifico que sea porque el archivo no existe y creo uno con un array vacio
			if (error.code == 'ENOENT') {
				await fs.writeFile(this.filename, '[]');
				// Luego de crearlo, leo su valor para que la funcion devuelva un valor al ser llamada
				file = await fs.readFile(this.filename, 'utf-8');
			} else {
				// Si el error es por otra cosa, lo muestro por consola
				console.log(error);
			}
		}

		return file;
	}

	async save(newData) {
		let file = await this.createFileIfNoneExist();
		// console.log(file);
		if (Array.isArray(newData)) {
			try {
				const data = JSON.parse(file);

				let currentId = 1;

				newData.forEach(item => {
					if (data.length > 0) {
						item.id = data.at(-1).id + 1;
					} else {
						item.id = currentId;
						currentId++;
					}
					data.push(item);
				});

				// console.log(data);

				await fs.writeFile(
					path.join(__dirname, this.filename),
					JSON.stringify(data, null, 2)
				);
			} catch (err) {
				console.log(err);
			}
		} else {
			try {
				const data = JSON.parse(
					await fs.readFile(path.join(__dirname, this.filename))
				);

				newData.id = data.length > 0 ? data[data.length - 1].id + 1 : 1;

				data.push(newData);

				await fs.writeFile(
					path.join(__dirname, this.filename),
					JSON.stringify(data, null, 2)
				);
			} catch (err) {
				console.log(err);
			}
		}
	}

	async getById(id) {
		try {
			const data = JSON.parse(
				await fs.readFile(path.join(__dirname, this.filename))
			);

			const match = data.filter((item, index) => item.id === id);
			if (match.length) {
				return match;
			}

			return 'Item not found';
		} catch (err) {
			console.log(err);
		}
	}

	async getAll() {
		try {
			return JSON.parse(await fs.readFile(path.join(__dirname, this.filename)));
		} catch (err) {
			console.log(err);
		}
	}

	async deleteById(id) {
		try {
			const data = JSON.parse(
				await fs.readFile(path.join(__dirname, this.filename))
			);

			const newData = data.filter((item, index) => item.id !== id);

			// console.log(newData);

			await fs.writeFile(
				path.join(__dirname, this.filename),
				JSON.stringify(newData, null, 2)
			);
		} catch (err) {
			console.log(err);
		}
	}

	async deleteAll() {
		try {
			await fs.writeFile(path.join(__dirname, this.filename), '[]');
		} catch (err) {
			console.log(err);
		}
	}
}

const container = new Contenedor('products.json');

// Pequeño problema, si haces save y deleteById en la misma ejecución del archivo se guarda la información mal. Estimo que es porque el delete agarra la info antes de que el save la modifique, pero no estoy seguro.

// container.save([
// 	{
// 		title: 'Test',
// 		price: 260,
// 		thumbnail: 'A long link',
// 	},
// 	{
// 		title: 'Escuadra',
// 		price: 123.45,
// 		thumbnail:
// 			'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png',
// 	},
// 	{
// 		title: 'Calculadora',
// 		price: 234.56,
// 		thumbnail:
// 			'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png',
// 	},
// 	{
// 		title: 'Globo Terráqueo',
// 		price: 345.67,
// 		thumbnail:
// 			'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',
// 	},
// ]);

// container.getById(5).then(res => console.log(res));

// container.deleteById(4);
// container.getById(1).then(res => console.log(res));
container.getAll().then(res => console.log(res));