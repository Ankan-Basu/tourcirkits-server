const express = require('express');
const {connectToDB, client} = require('./utility/db');
const path = require('path');
const dataRoutes = require('./routes/dataRoutes');
const mailRoutes = require('./routes/mailRoutes');
const { default: axios } = require('axios');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

const port = 5000

connectToDB().then(() => {
  app.listen(port, () => console.log('Server started.'));
}).catch((err) => console.log(err));

// const db = 'tours_database';

app.use(dataRoutes);
app.use(mailRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})