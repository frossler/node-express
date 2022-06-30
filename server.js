const express = require('express');
const { engine: handlebars } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const Productos = require('./Productos');
const Mensajes = require('./Mensajes');
const { default: faker } = require('@faker-js/faker');
const { normalize, schema } = require('normalizr');
const util = require('util');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine(
  'hbs',
  handlebars({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    defaultLayout: 'index',
    extname: 'hbs',
  })
);

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const products = new Productos();
const mensajes = new Mensajes();

// Normalizr

const author = new schema.Entity('authors');

const message = new schema.Entity('messages', {
  author: author,
});

const messagesSchema = new schema.Array(message);

function print(data) {
  console.log(util.inspect(data, false, 12, true));
}

app.get('/api/messages', async (req, res) => {
  const messages = await mensajes.getAll();

  res.json(normalize(messages, messagesSchema))
})

app.get('/', async (req, res) => {
  const productos = await products.getAll();

  let messages = await mensajes.getAll();

  // console.log(messages);
  // print(normalize(messages, messagesSchema));

  res.render('main', { title: 'Productos', productos, messages });
});

app.get('/api/productos-test', async (req, res) => {
  const productos = [1, 2, 3, 4, 5].map((id) => {
    return {
      id,
      title: faker.commerce.product(),
      price: faker.commerce.price(),
      thumbnail: faker.image.image(),
    };
  });

  res.render('random', { title: 'Productos Random', productos });
});

io.on('connection', (socket) => {
  console.log('New conection', socket.id);

  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
  });

  socket.on('add-product', (product) => {
    // console.log(product);

    products.addProduct(product);

    io.emit('update-products', product);
  });

  socket.on('message', async (message) => {
    const data = {
      author: {
        id: message.author.id,
        nombre: message.author.nombre,
        apellido: message.author.apellido,
        alias: message.author.alias,
        edad: message.author.edad,
        avatar: message.author.avatar,
      },
      text: message.text,
      date: new Date()
    };

    // console.log(message);

    await mensajes.save(data);

    io.emit('message', data);
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ err, message: 'Something went wrong, sorry' });
});

const PORT = process.env.PORT || 3005;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.log(`Algo salio mal: ${err}`);
});
