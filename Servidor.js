const express = require('express');
const Contenedor = require('./Contenedor');

const app = express();

app.get('/products', async (req, res) => {
	const productsFile = new Contenedor('products.json');

	const products = await productsFile.getAll();

	res.json(products);
});

app.get('/randomProduct', async (req, res) => {
	const productsFile = new Contenedor('products.json');

	const products = await productsFile.getAll();

	const random = Math.floor(Math.random() * products.length);

	res.json(products[random]);
});

app.listen('8080', () => {
	console.log(`Servidor corriendo en puerto 8080`);
});
