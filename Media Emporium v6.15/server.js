const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
require('./auth');
const pool = require('./db');

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

const app = express();
const PORT = process.env.PORT;
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // ✅ Required to parse JSON bodies

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

app.use('/profile', require('./routes/profile'));

app.use('/profile', require('./routes/upload'));

const postRoutes = require('./routes/posts');
app.use('/posts', postRoutes);

const fypRoutes = require('./routes/fyp');
const likeRoutes = require('./routes/likes');
app.use('/fyp', fypRoutes);
app.use('/likes', likeRoutes);

const seenRoute = require('./routes/seen');
app.use("/seen", seenRoute);

const reelsRoute = require('./routes/reels');
app.use('/reels', reelsRoute);

app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/profile.html',
    failureRedirect: '/auth/failure'
  })
);

app.get('/auth/failure', (req, res) => {
    res.send('something went wrong..');
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/Welcome.html');
    });
  });
});  

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});