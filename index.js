const express = require('express');
const {connectToDB, client} = require('./utility/db');
const path = require('path');
const dataRoutes = require('./routes/dataRoutes');
const authRoutes = require('./routes/authRoutes');
const isAuthenticated = require('./middlewares/isAuthenticated')
const { default: axios } = require('axios');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json())

const port = 5000

connectToDB().then(() => {
  app.listen(port, () => console.log('Server started.'));
}).catch((err) => console.log(err));

// const db = 'tours_database';

app.use(dataRoutes);
app.use('/auth', authRoutes);

app.post('/test', (req, res) => {
  console.log(req.body);
  res.json(req.body);
})

// app.use('/users', isAuthenticated, userRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})