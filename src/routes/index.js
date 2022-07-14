const express = require('express');
const router = express.Router()
const passport = require('passport');

const products = require('../models/fs/Productos');
const mensajes = require('../models/fs/Mensajes');


const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/User');
const bcrypt = require('bcrypt')



passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {

   try {

      const user = await User.findOne({ email })

      if (!user) return done(null, false)

      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) return done(null, false);

      return done(null, user);
   } catch (err) {
      console.log(err);
      done(err)
   }
}))

passport.serializeUser(function (user, cb) {
   process.nextTick(function () {
      cb(null, { id: user.id, email: user.email });
   })
})


passport.deserializeUser(function (user, cb) {
   process.nextTick(function () {
      return cb(null, user);
   })
})

router.get('/api/messages', async (req, res) => {
   const messages = await mensajes.getAll();

   res.json(messages);
});

router.get('/', async (req, res) => {
   if (!req.user) {
      return res.redirect('/login');
   }

   const productos = await products.getAll();

   let messages = await mensajes.getAll();

   res.render('main', { title: 'Productos', productos, messages });
});

router.get('/login', async (req, res) => {
   res.render('login', { title: 'Login' });
});

router.get('/register', async (req, res) => {
   res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
   try {
      if (!req.body.email || !req.body.password) {
         return res.json({
            error: true,
            message: "Missing information"
         })
      }

      const user = await User.findOne({ email: req.body.email });

      if (user) return res.json({ error: true, message: 'Email ya registrado' })

      const hashedPw = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
         email: req.body.email,
         password: hashedPw
      })

      await newUser.save()

   } catch (err) {
      console.log(err);
      return res.json({ error: err })
   }
})




router.post('/login', passport.authenticate('local', { session: true }), async (req, res) => {
   console.log(req.user);

   return res.json({
      redirect: '/',
   });
});



router.get('/logout', async (req, res) => {
   if (!req.user) return res.redirect('/login');
   const email = req.user.email
   req.logout((err) => {
      if (err) return
      return res.render('logout', { title: 'Logout', name: email });
   })

});


module.exports = router