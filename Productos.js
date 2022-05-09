class Productos {
	productos = [
		{
			title: 'Maqueta',
			price: 500,
			thumbnail: 'lognstring uurl',
			id: 1,
		},
		{
			title: 'Hola2',
			price: 500,
			thumbnail: 'lognstring uurl',
			id: 2,
		},
	];

	generateId() {
		const lastProduct = this.productos[this.productos.length - 1];
		console.log(lastProduct);
		let id = 1;
		if (lastProduct) {
			id = lastProduct.id + 1;
		}

		return id;
	}

	addProduct(newData) {
		newData.id = this.generateId();

		this.productos.push(newData);

		return this.productos;
	}

	getById(id) {
		return this.productos.find(product => product.id === parseInt(id));
	}

	update(id, data) {
		let updatedProduct;

		const updatedProducts = this.productos.map(product => {
			if (product.id === parseInt(id)) {
				product = Object.assign(product, data);

				updatedProduct = product;
			}
			return product;
		});

		this.productos = updatedProducts;

		return updatedProduct;
	}

	getAll() {
		return this.productos;
	}

	deleteById(id) {
		const newProducts = this.productos.filter(
			product => product.id !== parseInt(id)
		);

		this.productos = newProducts;

		return this.productos;
	}
}

module.exports = Productos;
