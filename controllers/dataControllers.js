const { convertCase } = require('../utility/convertCase');
const topSightsScraper = require('../scraper/topSights');
const descScraper = require('../scraper/desc');
const { client, db } = require('../utility/db');
const {searchHotels} = require('../scraper/booking');
const axios = require('axios');

module.exports.getTopSights = async (req, res) => {
  const id = convertCase(req.query.id);
  console.log('Top sights', id);
  // console.log(id);
  try {
    const dbRes = await client.db(db).collection('top_sights').findOne({ name: id });

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
          //save to db async
          client.db(db).collection('top_sights').insertOne(resObj);
          
          //respond to client
          res.status(200).json(resObj);
        } else {
          res.status(404).json(resObj);
        }
      } catch (err) {
        res.status(500).json(
          { name: id, topPlaces: [], timestamp: new Date().toJSON() }
        )
      }
    } else {
      res.status(200).json(dbRes);
    }

  } catch (err) {
    res.status(500).json({ name: id, topPlaces: [], timestamp: new Date().toJSON() });
  }
}

module.exports.getHotels = async (req, res) => {
  const id = convertCase(req.query.id);
  console.log('hotels', id);
  // console.log(id);
  try {
    const dbRes = await client.db(db).collection('hotels').findOne({ name: id });

    if (dbRes === null) {
      console.log('Empty');
      // res.status(500).json({ name: id, hotels: [], timestamp: new Date().toJSON() })
      try {
        console.log('Requesting API');
        const respArr = await searchHotels(id);
        const obj = {
          name: id,
          hotels: [...respArr],
          timestamp: new Date().toJSON()
        };

        //save to db async
        client.db(db).collection('hotels').insertOne(obj);
        
        //respond to client
        res.status(200).json(obj);
      } catch (err) {
        console.log('CATCH Api\n', err);
        res.status(500).json(
          { name: id, hotels: [], timestamp: new Date().toJSON() }
        )
      }
    } else {
      res.status(200).json(dbRes);
    }
  } catch(err) {
    console.log('CATCH db\n', err);
    res.status(500).json({ name: id, hotels: [], timestamp: new Date().toJSON() });
  }
}


module.exports.getDesc = async (req, res) => {
  const id = convertCase(req.query.id);
  console.log('desc', id);
  // console.log(id);

  try {
    const resArr = await descScraper(id);
    const resObj = {
      name: id,
      desc: resArr,
      timestamp: new Date().toJSON()
    }

    if (resArr.length > 0) {
      res.status(200).json(resObj);
    } else {
      res.status(404).json(resObj);
    }

  } catch (err) {
    res.status(500).json(
      { name: id, desc: [], timestamp: new Date().toJSON() }
    )
  }
}

module.exports.getSearch = async (req, res) => {
  try {

    // const queryStr = req.query.search;
    
    const url = 'http://localhost:8000/';
    // const url = 'https://tourcirkit.com/hotels/?id=Kolkata'


    // const x = await fetch(url);
    
    const x = await axios.get(url)
  
    const data = await x.data;
    res.status(200).json(data);
  } catch(err) {
    console.log("ERR_FLASK", err);
    res.sendStatus(500);
  }

}
