const express = require('express');
const {connectToDB, client} = require('./db');
const {convertCase} = require('./convertCase');
const topSightsScraper = require('./scraper/topSights');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

const port = 5000

connectToDB().then(() => {
  app.listen(port, () => console.log('Server started.'));
}).catch((err) => console.log(err));

const db = 'tours_database';




app.get('/top-sights/', async (req, res) => {
  const id = convertCase(req.query.id);
  console.log('Top sights', id);
  console.log(id);
  try {
    const dbRes = await client.db(db).collection('top_sights').findOne({name: id});

    if (dbRes === null) {
      console.log('Empty');
      try {
        const resArr = await topSightsScraper(id);
        const resObj = {
          name: id,
          topPlaces: resArr,
          timestamp: new Date().toJSON()
        }
        if (resArr.length > 0) {
          res.status(200).json(resObj);
        } else {
          res.status(404).json(resObj);
        }
      } catch(err) {
        res.status(500).json(
          {name: id, topPlaces: [], timestamp: new Date().toJSON()}
        ) 
      }
    } else {
      res.send(dbRes);
    }

  } catch(err) {
    res.status(500).json({name: id, topPlaces: [], timestamp: new Date().toJSON()});
  }
});

app.get('/hotels/', async (req, res) => {
  const id = convertCase(req.query.id);
  console.log('hotels', id);
  console.log(id);
  try {
    const dbRes = await client.db(db).collection('hotels').findOne({name: id});

    if (dbRes === null) {
      console.log('Empty');
      res.status(500).json({name: id, hotels: [], timestamp: new Date().toJSON()})
    } else {
      res.send(dbRes);
    }
  } catch(err) {
    res.status(500).json({name: id, hotels: [], timestamp: new Date().toJSON()});
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})