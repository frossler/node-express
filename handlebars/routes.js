const { Router } = require('express');
const Productos = require('./Productos');

const router = Router();
const products = new Productos();

router.get('/', (req, res) => {
	const productos = products.getAll();
	// const productos = [];

	res.render('list', { title: 'Productos', productos });
});

router.get('/:id', (req, res) => {
	const { id } = req.params;

	const product = products.getById(id);

	if (!product) {
		return res.json({ error: 'producto no encontrado' });
	}

	res.json(product);
});

router.post('/', (req, res) => {
	const { title, price, thumbnail } = req.body;

	products.addProduct({
		title,
		price,
		thumbnail,
	});

	res.redirect('/');
});

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { title, price, thumbnail } = req.body;

	const product = products.update(id, {
		title,
		price,
		thumbnail,
	});

	res.json(product);
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;

	const product = products.deleteById(id);

	res.json(product);
});

module.exports = router;
