const express = require('express');
const { engine: handlebars } = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const products = require('./models/fs/Productos');
const mensajes = require('./models/fs/Mensajes');
const http = require('http');
const sessionToLocals = require('./middlewares/sessionToLocals');
const router = require('./routes');
const passport = require('passport')

const app = express();
const server = http.createServer(app);
const io = new Server(server);


mongoose.connect('mongodb://fran:proyectocoder@cluster1-shard-00-00.zzoqs.mongodb.net:27017,cluster1-shard-00-01.zzoqs.mongodb.net:27017,cluster1-shard-00-02.zzoqs.mongodb.net:27017/ecommerce?replicaSet=atlas-wwir4a-shard-0&ssl=true&authSource=admin').then(res => console.log('Conectado a DB')).catch(err => console.log(err))

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
         maxAge: 1000 * 60 * 10,
      },
      store: MongoStore.create({
         mongoUrl:
            'mongodb://fran:proyectocoder@cluster1-shard-00-00.zzoqs.mongodb.net:27017,cluster1-shard-00-01.zzoqs.mongodb.net:27017,cluster1-shard-00-02.zzoqs.mongodb.net:27017/ecommerce?replicaSet=atlas-wwir4a-shard-0&ssl=true&authSource=admin',
         dbName: 'ecommerce',
         collectionName: 'sessions',
      }),
   })
);

app.use(passport.authenticate('session'))


app.use(sessionToLocals)

app.use(router)


io.on('connection', (socket) => {
   console.log('New conection', socket.id);

   socket.on('disconnect', () => {
      console.log(socket.id, 'disconnected');
   });

   socket.on('add-product', async (product) => {

      console.log(product)

      await products.save(product);

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
