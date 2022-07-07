const express = require('express');
const { engine: handlebars } = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Productos = require('./Productos');
const Mensajes = require('./Mensajes');
const http = require('http');

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
app.use(
  session({
    secret: 'foo',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60,
    },
    store: MongoStore.create({
      mongoUrl:
        'mongodb://fran:proyectocoder@cluster1-shard-00-00.zzoqs.mongodb.net:27017,cluster1-shard-00-01.zzoqs.mongodb.net:27017,cluster1-shard-00-02.zzoqs.mongodb.net:27017/test?replicaSet=atlas-wwir4a-shard-0&ssl=true&authSource=admin',
      dbName: 'ecommerce',
      collectionName: 'sessions',
    }),
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }

  next();
});

const products = new Productos();
const mensajes = new Mensajes();

app.get('/api/messages', async (req, res) => {
  const messages = await mensajes.getAll();

  res.json(messages, messagesSchema);
});

app.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const productos = await products.getAll();

  let messages = await mensajes.getAll();

  res.render('main', { title: 'Productos', productos, messages });
});

app.get('/login', async (req, res) => {
  res.render('login', { title: 'Login' });
});

app.post('/login', async (req, res) => {
  console.log(req.body);
  if (!req.body.name) {
    return res.json({
      error: true,
      message: 'Nombre es requerido',
    });
  }

  req.session.user = { name: req.body.name };

  return res.json({
    redirect: '/',
  });
});

app.get('/logout', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const name = req.session.user.name;
  req.session.destroy();
  res.render('logout', { title: 'Logout', name });
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
      date: new Date(),
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
